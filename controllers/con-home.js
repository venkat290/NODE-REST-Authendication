const  reqHelper = require('../lib/reqHelper');

exports.notFound = (req, res) =>{
  try{
    console.log("404 Found")
    res.status(404).send();
  }catch(err){
   // throw Exceiption;
   next(err.stack);
  }  
};
//how u r able to read req,res and how promise then function have parameter value
exports.createUsers = (req, res) => {
  try{
    reqHelper.signUP({email:req.body.email,password:req.body.password}).then((result) => {
      res.status(200).send({"success":true,"Users":result});
    }).catch((err)=>{
      res.status(500).send(err);
    })
  }catch(err){
    res.status(500).send(err);
  }  
};

exports.updateUser = (req, res) => {
  try{
    reqHelper.updateUser(req.body._id, {name:req.body.name}).then((result) => {
      res.status(200).send({"success":true,"Users":result});
    }).catch((err)=>{
      res.status(404).send(err);
    })
  }catch(err){
    res.status(500).send(err);
  }  
};

exports.deleteUser = (req, res) => {
  try{
    reqHelper.deleteUser(req.body._id).then((result) => {
      res.status(200).send({"success":true,"Users":result});
    }).catch((err)=>{
      res.status(404).send(err);
    })
  }catch(err){
    res.status(500).send(err);
  }  
};

exports.getUsers = (req, res) =>{
  try {
    const _id = req.query._id;
    reqHelper.getUsers(_id).then((result)=>{
      res.status(200).send({"success":true,"Users":result});
    }).catch((err)=>{
      res.status(500).send(err);
    })
  } catch(err){
    res.status(500).send(err.stack);
  }  
};