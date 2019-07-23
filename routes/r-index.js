const jwt = require('jsonwebtoken');
const conHome = require('../controllers/con-home');
const { SECURITY } = require('../constants');
module.exports = (app) => {   
    app.get('/getItems',conHome.getItems);
    app.get('/getAPIItems',conHome.getAPIItems);
    app.get('/getUsers',conHome.getUsers);    
    app.all('*',conHome.notFound);
};