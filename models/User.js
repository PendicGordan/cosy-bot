'use strict';
const {TE, to}          = require('../services/UtilService');
const jwt           	= require('jsonwebtoken');
const CONFIG            = require('../config/config');
const bcrypt         = require('bcrypt');
const bcrypt_p       = require('bcrypt-promise');

module.exports = (sequelize, DataTypes) => {
    let Model = sequelize.define('Users', {
        id          : { type: DataTypes.INTEGER.UNSIGNED,  primaryKey: true, autoIncrement: true,},
        email       : { type: DataTypes.STRING,        allowNull: false, unique: true   },
        password    : { type: DataTypes.STRING,        allowNull: false                 },
        verified    : { type: DataTypes.BOOLEAN,       defaultValue: false },
        hash        : { type: DataTypes.STRING,        allowNull: true                 }
    },{
        timestamps : true
    });

    Model.associate = (models) => {

    };

    Model.prototype.comparePassword = async function (pw) {
        let err, pass;

        [err, pass] = await to(bcrypt_p.compare(pw, this.password));
        if(err) TE(err);

        if(!pass) TE('Invalid password!');

        return this;
    };

    Model.prototype.getJWT = (id) => {
        let expiration_time = parseInt(CONFIG.jwt_expiration);
        return jwt.sign({userId: id}, CONFIG.jwt_encryption, {expiresIn: expiration_time});
    };

    Model.prototype.toWeb = () => {
        let json = this.toJSON();
        return json;
    };

    return Model;
};
