module.exports = (express, passport) => {
    const router = express.Router();
    // ----------- Bot Routes  -----------
    const bots = require('./botsRoutes')(router, passport);
    router.use('/bots', bots);
    return router;
};
