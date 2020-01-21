const BotController 	           = require('../../controllers/bot.controller');
module.exports = function (router) {
    router.post('/hello',          BotController.hello);
    return router;
};
