require('dotenv').config();
require('dotenv');
const homey = require('athom-api');
const course = require('./router/courses');
const express = require('express');
const config = require('config');
const app = express();
const debug = require('debug')('app:startup');
try {
    app.use(express.json());
    //app.use(express.urlencoded({ extended: true }));
    app.use('/api/courses', course);
}
catch (err) {
    debug(err);
}
;
var validateObject = function (obj, callback) {
    setTimeout(() => {
        if (typeof obj === 'object') {
            return callback(new Error('Invalid object'), 3);
        }
        return callback(new Error('valid object'), 5);
    }, 2000);
};
validateObject('123', function (err, result) {
    console.log('Callback: ' + err.message + " " + result);
});
debug(`the enviroment here is ${process.env.NODE_ENV}`);
debug('Application Name:' + config.get('name'));
debug('Mail Server Name:' + config.get('mail.host'));
debug('Hello I need to be debugged');
app.set('port', process.env.PORT || 3000);
debug(process.env.PORTVAL);
var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});