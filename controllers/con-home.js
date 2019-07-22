const  reqHlper = require('../lib/reqHelper');
const fetch = require('node-fetch');
exports.index = (req, res) => {
  try{
    let type=req.params.type;
    let input=req.body.input; 
    let output;  
    if(type==='1') {     
        let oddArray=[],evenArr=[];
        output=[];
        for(let i=0;i<input.length;i++){
        if(input[i]%2==0)
        evenArr.push(input[i]);
        else
        oddArray.push(input[i]); 
        }
        evenArr=evenArr.sort((a,b)=> a-b);
        oddArray=oddArray.sort((a,b)=> b-a);
        let oddIndex=0,evenIndex=0;
        while(output.length<input.length){
          if(oddArray[oddIndex]!=undefined) {output.push(oddArray[oddIndex]);oddIndex++};
          if(evenArr[evenIndex]!=undefined) {output.push(evenArr[evenIndex]);evenIndex++;}
        }
    } else if(type==='2'){
      let start=0,end=input.length-1;
      let tempOutput=[];
      while(start<end){     
          if((/^[a-zA-Z]+$/.test(input[start])) && (/^[a-zA-Z]+$/.test(input[end]))){
        tempOutput[start]=input[end];
        tempOutput[end]=input[start];
        start++,end--;
          }
      else if(/^[a-zA-Z]+$/.test(input[start]) && !(/^[a-zA-Z]+$/.test(input[end]))){
              tempOutput[end]=input[end];
            end--;
          }
          else if(!(/^[a-zA-Z]+$/.test(input[start])) && (/^[a-zA-Z]+$/.test(input[end]))){
        tempOutput[start]=input[start];
              start++;
          }else{
        tempOutput[start]=input[start];
        tempOutput[end]=input[end];
        start++,end--;
          }
      }
      output=tempOutput.join('');
    } else if(type==='3'){
      output=[];
      input=input.sort((a,b)=>a-b);
      input.forEach((element,key) => {
        for(let i=element+1;i<input[key+1];i++){
            output.push(i);
        }
      });
    }
    res.status(200).send(typeof output=="string" ? output : JSON.stringify(output))
  }catch(err){
    res.status(500).send({"success":false,"message":err.message})
  }
  
};
exports.signup = (req, res) =>{
  let email=req.body.email ? req.body.email : null;
  let password=req.body.password ? req.body.password : null;
  let name=req.body.name ? req.body.name : null;
  if(email && password){
    let recordProm=reqHlper.signUP({name,email,password});
    recordProm.then(result =>{
       res.status(200).send({"success":true,"Message":"Record Created Successfully, Please try to Login with Credentials."});
    }).catch(err=>{
      console.log(err);
      if(err.code==11000)
      res.status(400).send({"success":false,"Message":"Email Duplicating"});
      else
      res.status(500).send({"success":false,"Message":"Something Went Wrong"});
    })
  }else{
    res.status(400).send({"success":false,"Message":"validation Error"});
  }  
};
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
    console.log("Came here")
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