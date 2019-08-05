const  reqHlper = require('./lib/reqHelper');
module.exports.fetchAPI=(url='https://reqres.in/api/users?page=1')=>{
    return reqHlper.fetchAPI(url);
}