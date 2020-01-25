'use strict';
const {TE, to}          = require('../services/UtilService');
const jwt           	= require('jsonwebtoken');
const CONFIG            = require('../config/config');
const bcrypt         = require('bcrypt');
const bcrypt_p       = require('bcrypt-promise');

module.exports = (sequelize, DataTypes) => {
    let Model = sequelize.define('Companies', {
        id          : { type: DataTypes.INTEGER.UNSIGNED,  primaryKey: true, autoIncrement: true,},
        email       : { type: DataTypes.STRING,        allowNull: false, unique: true   },
        accepted    : { type: DataTypes.BOOLEAN,       defaultValue: false },
        declined    : { type: DataTypes.BOOLEAN,       defaultValue: false },
        time        : { type: DataTypes.DATE,          allowNull: true, defaultValue: new Date() },
        message     : { type: DataTypes.STRING,        allowNull: true                 }
    },{
        timestamps : true
    });

    Model.associate = (models) => {

    };

    Model.prototype.toWeb = () => {
        let json = this.toJSON();
        return json;
    };

    return Model;
};
