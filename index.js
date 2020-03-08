const express = require('express');
const app = express();

// BodyParser Middleware
const bodyParser = require('body-parser');

app.use(bodyParser.json());

require('./models');

// Routes
require('./routes/r-index')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log(`Server ${process.pid} started with ${PORT}`);

