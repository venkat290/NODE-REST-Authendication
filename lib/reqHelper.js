const User = require('../models/User');
module.exports.userLogin_Promise = (email, password) => {
    return User.find({ email,password });    
};
module.exports.signUP = (obj) => {
    let userRecord = new User(obj);
    return userRecord.save();    
};
module.exports.userLogin_Promise = (email, password) => {
    return User.find({ email,password });    
};
module.exports.getUsers = (email, password) => {
    return User.find({});    
};