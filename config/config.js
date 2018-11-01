require('dotenv').config(); //instatiate environment variables

//Make this global to use all over the application
CONFIG = {
    "development": {
        "username": process.env.DATABASE_USER,
        "password": process.env.DATABASE_PASSWORD,
        "database": process.env.DATABASE_NAME,
        "host": process.env.DATABASE_HOST,
        "dialect": "mysql"
    },
    "test": {
        "username": process.env.DATABASE_USER,
        "password": process.env.DATABASE_PASSWORD,
        "database": process.env.DATABASE_NAME,
        "host": process.env.DATABASE_HOST,
        "dialect": "mysql"
    },
    "production": {
        "username": process.env.DATABASE_USER,
        "password": process.env.DATABASE_PASSWORD,
        "database": process.env.DATABASE_NAME,
        "host": process.env.DATABASE_HOST,
        "dialect": "mysql"
    }
};

CONFIG.app          = process.env.APP   || 'development';
CONFIG.port         = process.env.API_PORT  || '3000';

CONFIG.db_name      = process.env.DATABASE_NAME       || 'test';
CONFIG.dialect      = process.env.DATABASE_DIALECT    || 'mysql';
CONFIG.db_host      = process.env.DATABASE_HOST       || 'localhost';
CONFIG.db_port      = process.env.DATABASE_PORT       || '3000';
CONFIG.db_user      = process.env.DATABASE_USER       || 'root';
CONFIG.db_password  = process.env.DATABASE_PASSWORD   || '2431996fkjuventus';

CONFIG.jwt_encryption  = process.env.JWT_ENCRYPTION || 'JwTsEcReTeNcRyPtIon2019';
CONFIG.jwt_expiration  = process.env.JWT_EXPIRATION || '10000';

module.exports = CONFIG;
