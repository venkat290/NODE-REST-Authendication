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
module.exports.getUsers = (_id = 0) => {
    if(_id)
    return User.findById(_id);
    else
    return User.find({});    
};
module.exports.updateUser = (_id = 0, obj) => {
    return User.findByIdAndUpdate(_id, obj);  
};
module.exports.deleteUser = (_id = 0) => {
    return User.findOneAndDelete({_id});  
};