//var bodyParser = require('body-parser');
var methodOverride = require('method-override');
const { NODE_ENV } = require('../constants');

module.exports = app => {
  //error middleware
  // app.use(bodyParser.urlencoded({
  //   extended: true
  // }))
  // app.use(bodyParser.json())
  app.use(methodOverride());
  app.use(logErrors);
  app.use(clientErrorHandler);
  app.use(errorHandler);

  function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
  }

  function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
      res.status(500).send({ error: 'Something failed!' });
    } else {
      next(err);
    }
  }

  function errorHandler(err, req, res, next) {
    if (res.headersSent) {
      return next(err);
    }
    res.status(500);
    res.render('error.dot', { error: err, env: NODE_ENV });
  }
};
