const BotController 	           = require('../../controllers/bot.controller');
module.exports = function (router) {
    router.post('/hello',                 BotController.hello);
    router.get('/companies',              BotController.getCompanies);
    router.post('/company/checkDate',       BotController.checkDateAvailability);
    return router;
};
