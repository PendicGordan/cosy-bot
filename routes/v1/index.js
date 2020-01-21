const path         = require('path');
const rootDir      = require('../../utils/path');

module.exports = (express, passport) => {
    const router = express.Router();

    // ----------- User Routes  -----------
    const users = require('./userRoutes')(router, passport);
    router.use('/users', users);

    // ----------- Bot Routes  -----------
    const bots = require('./botsRoutes')(router, passport);
    router.use('/bots', bots);

    return router;
};
