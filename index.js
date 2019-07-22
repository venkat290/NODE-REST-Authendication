const express = require('express');
const app = express();
const passport = require('passport');
// BodyParser Middleware
const bodyParser = require('body-parser');
const { SECURITY } = require('./constants');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/public', express.static(path.join(__dirname, 'build')));

require('./models');

// Passport init
// app.use(passport.initialize());


//   app.use(function (req, res,next) {
//     var send = res.send;
//     res.send = function (body) { // It might be a little tricky here, because send supports a variety of arguments, and you have to make sure you support all of them!
//         // Do something with the body...
//         console.log("Request Send",body)
//         send.call(this, body);
//     };
//     next();
// });

// load passport strategies
require('./config/passport')(passport);

// Routes
require('./routes/r-index')(app, passport);

// Nock for HTTP Request Test
require('./lib/nockTest');

// Load Error Configuration
require('./config/error.js')(app);



//For unhandled Error occurence
app.use(function (err, req, res, next) {
    console.log(err)
    if (req.app.get('env') !== 'development') {
        delete err.stack;
    }
	/* Finaly respond to the request */
    res.status(err.statusCode || 500).json(err);
});

/*
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running number of core ${numCPUs}`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT);
  console.log(`Server ${process.pid} started with ${PORT}`);
}
*/
const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log(`Server ${process.pid} started with ${PORT}`);

