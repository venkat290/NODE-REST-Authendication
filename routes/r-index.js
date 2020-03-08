const conHome = require('../controllers/con-home');
const { SECURITY } = require('../constants');
module.exports = (app) => {  
    app.get('/getUsers',conHome.getUsers);    
    app.post('/createUsers',conHome.createUsers);     
    app.put('/updateUser',conHome.updateUser);    
    app.delete('/deleteUser',conHome.deleteUser); 
    //app.delete('/patchUser',conHome.deleteUser);    
    app.all('*',conHome.notFound);
};