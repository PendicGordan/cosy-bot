const {
    sequelize,
    Users
} = require('../models')

const users = require('./users.json')

const _ = require('lodash');

sequelize
    .query('SET FOREIGN_KEY_CHECKS = 0', {raw: true})
    .then(function(results) {
        sequelize.sync({force: false})
            .then(async function () {
                await Promise.all(
                    users.map(user => {
                        Users.create(user)
                    })
                )
            })
    })

