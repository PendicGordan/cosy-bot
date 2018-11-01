const {Users}                       = require('../models');
const {ReE, ReS, to, getAge }       = require('../services/UtilService');
const bcrypt                        = require('bcryptjs');
const validator                     = require('validator');
const randomstring                  = require('randomstring');
const nodemailer                    = require('nodemailer');
const moment                        = require('moment');
const sendgridTransport             = require('nodemailer-sendgrid-transport');
const PASSWORD_PATTERN = '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$';

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
}));

const create = async function(req, res){
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if(typeof email === 'undefined' || typeof password === 'undefined') {
        return ReE(res, 'Error: Data not valid!');
    } else if(!validator.isEmail(email) || !validator.matches(password, PASSWORD_PATTERN)){
        return ReE(res, 'Error: Data not valid!');
    }

    let err, user;
    [err, user] = await to(Users.findOne({where: { email: email }}));
    if(err) return ReE(res, err);

    if (user) {
        return ReE(res, 'User already exists.');
    }

    if(password !== confirmPassword) {
        return ReE(res, `Passwords don't match.`);
    }

    bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            const newUser = new Users({
                email: email,
                password: hashedPassword,
                hash: randomstring.generate(20)
            });
            return newUser.save();
        })
        .then(newUser => {
            transporter.sendMail({
                to: email,
                from: 'Our site<no-reply@example.com>',
                subject: 'Signup Successfull!',
                html: `<h1>Congratulations, you have successfully signed up!</h1><p>Please verify your account: <a href="http://localhost:3000/v1/users/verify?v=${newUser.dataValues.hash}">Verify Account</a></p>`
            });
            return ReS(res, {token: newUser.getJWT(newUser.dataValues.id)});
        })
        .catch(err => {
            console.log(err);
        });
};
module.exports.create = create;

const verify = async function(req, res) {
    let err, user;
    let hash = req.query.v;
    [err, user] = await to(Users.findOne({where: { hash: hash }}));
    if(err) return ReE(res, 'Find Account error.');
    else if(!user) return ReE(res, 'Access Denied.');

    // if(moment().diff(user.createdAt, 'minutes') > 30);

    user.verified = true;
    [err, user] = await to(user.save());
    if(err) return ReE(res, 'Saving user error.');

    return ReS(res, {
        message: 'Account successfully verified!',
        token: user.getJWT(user.dataValues.id)
    });
}
module.exports.verify = verify;

const login = async function(req, res){
    let email = req.body.email;
    let password = req.body.password;
    if(typeof email === 'undefined' || typeof password === 'undefined') {
        return ReE(res, 'Error: Data not valid!');
    } else if(!validator.isEmail(email) || !validator.matches(password, PASSWORD_PATTERN)){
        return ReE(res, 'Error: Data not valid!');
    }

    let err, user;
    [err, user] = await to(Users.findOne({where: {email: email}}));
    if(err) return ReE(res, 'Find Account error.');
    else if(!user) return ReE(res, 'Account not registered.');

    [err, user] = await to(user.comparePassword(password));
    if(err) return ReE(res, err.message);

    return ReS(res, {
        token: user.getJWT(user.dataValues.id)
    });
};
module.exports.login = login;

const remove = async function(req, res){
    let user, err;
    user = req.user;
    console.log(user);
    [err, user] = await to(user.destroy());
    if(err) return ReE(res, 'Error occurred trying to delete user.');
    return ReS(res, {message:'Deleted User'}, 204);
};
module.exports.remove = remove;

const resetPW = async function (req, res){
    const {Users} = require('../models');

    let err, user;
    [err, user] = await to(Users.findOne({where: {email: req.body.email}}));

    if(!user) {
        return ReE(res, 'User with email: ' + req.body.email + ' not registered!');
    }

    if(sendResetEmail(req.body.email, user.dataValues.hash, user.getJWT(user.dataValues.id)))
        return ReS(res, {message:'A reset email was sent to ' + user.dataValues.email + '.'});
    return ReE(res, 'Error sending reset email');
};
module.exports.resetPW = resetPW;

const sendResetEmail = async function(toMail, hash, token) {
    let err, data;
    [err, data] = await to(transporter.sendMail({
        to: toMail,
        from: 'Our site<no-reply@example.com>',
        subject: 'Our-site - Email Reset',
        text: 'Please click on the following link in order to reset password:',
        html: '<p>Click to reset: http://localhost:4000/reset?h=' + hash + '&token=' + token + '</p>'
    }));

    if(err) {
        TE('Error sending reset email. ' + err.message);
        return false;
    }
    return true;
};
module.exports.sendResetEmail = sendResetEmail;

const checkTokenAndHash = async function (req, res){
    if(req.user === undefined) return ReE(res, 'Access Denied');

    const {Users} = require('../models');
    let err, user;

    [err, user] = await to(Users.findById(req.user.dataValues.id));
    if(!user) return ReE(res, 'Access Denied');

    if(user.dataValues.hash !== req.query.h) return ReE(res, 'Access Denied');
    return ReS(res, {message:'Success'});
};
module.exports.checkTokenAndHash = checkTokenAndHash;

const changePassword = async function(req, res){
    if (!validator.matches(req.body.password, PASSWORD_PATTERN)) return ReE(res, 'Invalid password parameter');
    if (req.body.password !== req.body.confirmPassword) return ReE(res, `Passwords don't match`);

    let password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 12);
    req.user.password = hashedPassword;
    let err, user;
    [err, user] = await to(req.user.save());
    if(err) return ReE(res, err);
    return ReS(res, {message :'Password successfully updated'});
};
module.exports.changePassword = changePassword;