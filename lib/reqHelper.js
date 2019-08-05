const User = require('../models/User');
const fetch = require('node-fetch');
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
module.exports.getUsers = (email, password) => {
    return User.find({});    
};
module.exports.fetchAPI=(url='https://reqres.in/api/users?page=1')=>{
    return fetch(url)
    .then(res => res.json())
}