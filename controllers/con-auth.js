// const models = require('../models');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const path = require('path');
const { SECURITY } = require('../constants');
const passport = require('../config/passport');
const { BASE_URL, NODE_ENV } = require('../constants');

const clearCookies = res => {
  res.clearCookie('jwt', { signed: true, secure: SECURITY.secure, httpOnly: true, domain: SECURITY.domain, maxAge: SECURITY.cookieMaxAge });
  res.clearCookie('jwtRefresh', { signed: true, secure: SECURITY.secure, httpOnly: true, domain: SECURITY.domain, maxAge: SECURITY.cookieMaxAge });
};

const newRefreshToken = (res, guid) => {
  res.locals.inactive = false;
  res.clearCookie('jwtRefresh', { signed: true, secure: SECURITY.secure, httpOnly: true, domain: SECURITY.domain, maxAge: SECURITY.cookieMaxAge });
  const RefreshToken = jwt.sign({ guid }, SECURITY.jwtSecretRefresh, { expiresIn: SECURITY.jwtExpireRefresh });
  res.cookie('jwtRefresh', RefreshToken, { signed: true, secure: SECURITY.secure, httpOnly: true, domain: SECURITY.domain, maxAge: SECURITY.cookieMaxAge });
};

const newAuthTokenPromise = (res, AccountID) => {
  res.locals.inactive = false;
  // console.log('Creating New Auth.');
  return reqHelper.getUserInfo_Promise(AccountID).then(userInfo => {
    newRefreshToken(res, AccountID);
    const token = jwt.sign(userInfo, SECURITY.jwtSecret, { expiresIn: SECURITY.jwtExpire });
    res.cookie('jwt', token, { signed: true, secure: SECURITY.secure, httpOnly: true, domain: SECURITY.domain, maxAge: SECURITY.cookieMaxAge });
    return Promise.resolve({ success: true });
  });
};
/*--------------------------------------------------------------------------
  // Index Page. Render login.dot with page specific js and css
--------------------------------------------------------------------------*/
exports.index = (req, res) => {
  const templateData = {
    error_msg: req.error_msg,
    env: NODE_ENV,
    vars: {
      companyData: {}
    },
    pageCSS: ''
  };

  res.render('auth.dot', templateData);
};

exports.logout = (req, res) => {
  req.logout();
  clearCookies(res);
  const templateData = {
    success_msg: 'You are now logged out',
    passwordResetURL: SECURITY.passwordResetURL,
    env: NODE_ENV,
    vars: {
      companyData: {}
    }
  };
  res.render('auth.dot', templateData);
};

exports.inactive = (req, res) => {
  req.logout();
  clearCookies(res);
  const templateData = {
    error_msg: 'You have been logged out due to inactivity',
    passwordResetURL: SECURITY.passwordResetURL,
    env: NODE_ENV,
    vars: {
      companyData: {}
    }
  };
  res.render('auth.dot', templateData);
};

exports.refresh = (req, res) => {
  // console.log(res);
  res.json({ inactive: res.locals.inactive });
};

exports.registerInfo = (req, res) => {
  const userInfo = req.user;
  conList
    .companiesAddress(userInfo.company.id)
    .then(result => {
      const templateData = {};
      templateData.address = result[0] ? result[0] : [];
      templateData.userInfo = userInfo;
      templateData.userInfo.validEmail = reqHelper.validateEmail(templateData.userInfo.email);
      templateData.env = NODE_ENV;
      res.render('registerInfo.dot', templateData);
    })
    .catch(error => {
      // console.log(error);
      const model = {};
      model.error = error.original.message;
      model.errorName = error.name;
      model.userInfo = userInfo;
      model.env = NODE_ENV;
      res.render('error.dot', model);
    });
};
exports.registerInfoUpdate = (req, res) => {
  const bind = {
    Businessname: req.body.businessName,
    Address: req.body.address,
    AccountName: req.body.name,
    Account: req.body.email,
    NewEncryptedPassword: passport.cryptHash(req.body.newPassword),
    AccountID: req.user.guid,
    CompanyID: req.body.CompanyID
  };
  conList
    .registerInfoUpdate(bind)
    .then(result => {
      let errorNo = 1;
      let errorMsg = '';
      if (typeof result[0] !== 'undefined' && typeof result[0][0] !== 'undefined') {
        if (typeof result[0][0].ErrorNumber !== 'undefined') {
          errorNo = result[0][0].ErrorNumber;
        } else if (typeof result[0][3].ErrorNumber !== 'undefined') {
          errorNo = result[0][3].ErrorNumber;
        } else {
          errorNo = 0;
        }

        if (typeof result[0][0].ErrorMessage !== 'undefined') {
          errorMsg = result[0][0].ErrorMessage;
        } else if (typeof result[0][3] !== 'undefined') {
          errorMsg = result[0][3].ErrorMessage;
        } else {
          errorMsg = '';
        }
      }
      if (errorNo) {
        res.send({ message: 'Failure', errorMsg });
      } else {
        newAuthTokenPromise(res, req.user.guid).then(() => {
          res.send({ message: 'Success' });
        });
      }
    })
    .catch(error => {
      // console.log(error);
      const errorMsg = error.original.message ? error.original.message : '';
      res.send({ message: 'Failure', error_no: 1, error_msg: errorMsg });
    });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  conList
    .getAccountInfo(email)
    .then(result => {
      if (result != null) {
        const tempPwd = Math.round(Math.pow(36, 5 + 1) - Math.random() * Math.pow(36, 5))
          .toString(36)
          .slice(1);
        const newPassword = passport.cryptHash(tempPwd);
        let p2 = Promise.resolve({});
        if (result.IsAccountLocked === 1) {
          p2 = conList.unlockAccount(SECURITY.adminEmail, result.AccountID, 0);
        }
        p2.then(() => {
          conList
            .resetPassword(SECURITY.adminEmail, SECURITY.adminPwd, email, newPassword)
            .then(info => {
              if (info[0][0].ErrorNumber === 0) {
                const model = {};
                model.Date = moment().format('MMMM DD, YYYY');
                model.tempPwd = tempPwd;
                model.loginURL = `${BASE_URL}/auth`;
                const emailPath = path.normalize(path.join(__dirname, '../views/emails/forgotPassword.dot'));
                const htmlBody = emailLib.getHTML(emailPath, model);
                emailLib.sendEmail(email, 'Forgot Password', htmlBody);
                res.send({
                  status: 'OK',
                  msg: 'Password Reset Email Sent Successfully. Please Follow Instruction for Password Reset.'
                });
              } else {
                res.send({
                  status: 'NOK',
                  error: info[0][0].ErrorMessage
                });
              }
            })
            .catch(() => {
              // console.log(error);
              res.send({
                status: 'NOK',
                error: 'Something went Wrong..'
              });
            });
        }).catch(() => {
          // console.log(err);
          res.send({
            status: 'NOK',
            error: 'Something went Wrong..'
          });
        });
      } else {
        res.send({
          status: 'NOK',
          error: 'Account Not Exist'
        });
      }
    })
    .catch(() => {
      // console.log(error);
      res.send({
        status: 'NOK',
        error: 'Something went Wrong..'
      });
    });
};
