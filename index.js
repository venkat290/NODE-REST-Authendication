const express = require('express');
const app = express();
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


// Routes
require('./routes/r-index')(app);

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

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log(`Server ${process.pid} started with ${PORT}`);

