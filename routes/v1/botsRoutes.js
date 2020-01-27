const BotController 	           = require('../../controllers/bot.controller');
module.exports = function (router) {
    router.post('/hello',                 BotController.hello);
    router.get('/companies',              BotController.getCompanies);
    router.post('/company/checkDate',     BotController.checkDateAvailability);
    router.post('/company/checkTime',     BotController.checkTimeAvailability);
    router.post('/company/checkPersons',  BotController.sendAmountOfPersons);
    router.post('/company/checkEmail',    BotController.checkEmail);
    router.post('/company/select',        BotController.selectCompany);
    return router;
};
