require('dotenv').config();

const express = require('express');
const path = require('node:path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const indexRouter = require('./routes/index');
const app = express();

//initialize database and meilisearch client
const db = require('./app/models/index');
const meiliSearchClient = require('./config/meilisearch').meilisearch;

app.set('db', db);
app.set('meiliSearchClient', meiliSearchClient);

//running event processing job
require('./app/services/Rabbitmq').initializeRabbitmq().then(result => {
});
require('./app/jobs/EventsProcessing');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/api', indexRouter);

app.get('/', function (Request, Response) {
  return Response.send('Server is running!')
});
// catch 404 and forward to error handler
app.use(function (Request, Response, next) {
  return Response.status(404).json("Route not found");
});

// error handler
app.use(function (err, Request, Response, next) {
  // set locals, only providing error in development
  Response.locals.message = err.message;
  Response.locals.error = Request.app.get('env') === 'development' ? err : {};

  // render the error page
  Response.status(err.status || 500);
  Response.json({'message': err.message});
});

module.exports = app;
