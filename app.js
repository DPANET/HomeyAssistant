
require('dotenv').config();
require('dotenv');
const course = require('./router/courses');
const express = require('express');
const config = require('config');
const app = express();
const startupDebugger = require('debug')('app:startup');

try
{
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
app.use('/api/courses', course);
}catch(err)
{
    startupDebugger(err);

};



startupDebugger(`the enviroment here is ${process.env.NODE_ENV}`);

startupDebugger('Application Name:' + config.get('name'));
startupDebugger('Mail Server Name:' + config.get('mail.host'));
startupDebugger('Hello I need to be debugged');

app.set('port', process.env.PORT || 3000);
startupDebugger(process.env.PORTVAL);
var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});




