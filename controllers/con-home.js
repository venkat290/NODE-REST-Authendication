const  reqHlper = require('../lib/reqHelper');
const fetch = require('node-fetch');

exports.getItems = (req, res,next) =>{
  try{
    res.status(200).send({"success":true,"counter":[{"id":"1","value":"1"}]});
  }catch(Exceiption){
   // throw Exceiption;
   next(Exceiption);
  }  
};
exports.getAPIItems = (req, res,next) =>{
  try{
    fetch('https://api.github.com/repos/atom/atom/license')
    .then(res => res.json())
    .then(response => {console.log(response);
      res.status(200).send(response);
    }).catch(error=>{
      console.log(error);
      res.status(500).send("Error");
    });
  }catch(Exceiption){
   // throw Exceiption;
   next(Exceiption);
  }  
};
exports.notFound = (req, res) =>{
  try{
    console.log("404 Found")
    res.status(404).send({});
  }catch(Exceiption){
   // throw Exceiption;
   next(Exceiption);
  }  
};
exports.getUsers = (req, res,next) =>{
  try{
    reqHlper.getUsers().then((result)=>{
      console.log(result);
      res.status(200).send({"success":true,"Users":result});
    }).catch((err)=>{
      next(err)
    })
  }catch(Exceiption){
   // throw Exceiption;
   next(Exceiption);
  }  
};
exports.sum=(a,b)=>{
  return a+b;
}