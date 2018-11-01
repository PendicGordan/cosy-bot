const UserController 	              = require('../../controllers/user.controller');

module.exports = function (router, passport) {
    const authUser                 = require('../../middleware/authUser')(passport);

    router.post('/register',                                    UserController.create);       // C
    router.post('/login',                                       UserController.login);        // R
    router.get('/verify',                                       UserController.verify);       // U
    router.delete('/',                  authUser,               UserController.remove);       // D
    router.post('/resetEmail',                                  UserController.resetPW);
    router.get('/resetEmail',           authUser,               UserController.checkTokenAndHash);
    router.post('/resetPassword',       authUser,               UserController.changePassword);

    return router;
};
