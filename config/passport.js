// const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
//const crypto = require('crypto');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const { SECURITY } = require('../constants');
const  reqHlper = require('../lib/reqHelper');

// Function for Retrieving the Auth Token from Signed Cookie
const tokenExtractor = req => {
  var token = null;
  if (req && req.body.token) {
    token = req.body.token;
  }
  // console.log(token);
  return token;
};


module.exports = passport => {
  // jwt Auth Token Strategy
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: tokenExtractor,
        secretOrKey: SECURITY.jwtSecret
      },
      function(jwtPayload, done) {        
        return done(null, jwtPayload);
      }
    )
  );

  // Authenticating the user from the Database
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      function(req, email, password, cb) {
          reqHlper.userLogin_Promise(email,password).then(res=>{
            if(res.length){
              return cb(null, res[0], { success_msg: 'Logged In Successfully' });
            }else{
              return cb(true, false, { error_msg: 'Error: Login Procedure Failed' });
            }            
          }).catch(err=>{
            console.log(err);
            return cb(true, false, { error_msg: 'Error: Login Procedure Failed' });
          })        
      }
    )
  );
};