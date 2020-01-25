const CONFIG       = require('./config/config');  // instantiate configuration variables
const express 		= require('express');
const logger 	    = require('morgan');
const bodyParser 	= require('body-parser');
const passport      = require('passport');
const pe            = require('parse-error');
const cors          = require('cors');

const app = express();

const v1 = require('./routes/v1/')(express, passport);

app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit:50000 }));

// Passport
app.use(passport.initialize());

// DATABASE
/*
const models = require("./models");
models.sequelize.authenticate()
    .then(() => {
    console.log('Connected to SQL database:', CONFIG.db_name);
    })
    .catch(err => {
        console.error('Unable to connect to SQL database:', CONFIG.db_name, err);
    });
*/
if(CONFIG.app === 'dev'){
    // models.sequelize.sync(/*{force: true}*/); // creates table if it does not already exist
}
app.use(cors());
app.use('/v1', v1);

app.use('/', function(req, res){
    res.statusCode = 200;//send the appropriate status code
    res.json({status:"success", message:"Parcel Pending API", data:{}})
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('.env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//This is here to handle all the uncaught promise rejections
process.on('unhandledRejection', error => {
    console.error('Uncaught Error', pe(error));
});

const port = CONFIG.port || '5000';

app.listen(port, () => {
    console.log('Server running on', port);
});

module.exports = app;
