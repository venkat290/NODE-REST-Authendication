const jwt = require('jsonwebtoken');
const conAuth = require('../controllers/con-auth');
const conHome = require('../controllers/con-home');
const { SECURITY } = require('../constants');
module.exports = (app, passport) => {   
      // Login Route
      app.post(
        '/auth',
        function(req, res, next) {
          passport.authenticate(
            'local',
            {
              session: false
            },
            (err, user, info = {}) => {
            console.log(err,user);
              if (err || !user) {
                res.status(401).send({ success: false });
              } else {
                newAuthToken_Promise(res, user).then(result => {
                    res.status(200).send(result);
                }).catch(err=>{
                    res.status(401).send({ success: false });
                });
              }
            }
          )(req, res, next);
        },
        conAuth.index
      );
    app.post('/api/:type',isLoggedIn,conHome.index);
    app.post('/signup',conHome.signup);
    app.get('/getItems',conHome.getItems);
    app.get('/getAPIItems',conHome.getAPIItems);
    app.get('/getUsers',conHome.getUsers);    
    app.all('*',conHome.notFound);

    function isLoggedIn(req, res, next) {
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
          if (err || !user) {
            res.status(401).send({ success: false });
          } else {
            req.user = user;
            return next();
          }
        })(req, res, next);
    }
};

var newAuthToken_Promise = (res, user) => {   
    try
    {
        let userInfo={id:user['_id'],email:user.email};
        const token = jwt.sign(userInfo, SECURITY.jwtSecret, { expiresIn: SECURITY.jwtExpire });
        return Promise.resolve({ success: true, token });
    }
    catch(err){
        return Promise.reject({ success: false });
    }
};