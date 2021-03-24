require("dotenv").config();
const express = require("express");
const mongodb = require("mongodb");
const bcrypt = require("bcrypt");
const mongoClient = mongodb.MongoClient;
const objectId = mongodb.ObjectID;
const app=express();
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017";
const port = process.env.PORT || 4000;
//const dbUrl = "mongodb://127.0.0.1:27017";
app.use(express.json());

app.get("/",async(req,res)=>{
  try{
    let clientInfo = await mongoClient.connect(dbUrl);
    let db = clientInfo.db("student");
    let data = await db.collection("student").find().toArray();
    res.status(200).json(data);
    clientInfo.close();
  }
  catch(error){
    console.log(error);
  }
  }
);

app.post('/register',async(req,res)=>{  
    try{
      let client = await mongoClient.connect(dbUrl);
      let db = client.db('student');
      let found = await db.collection("student").findOne({email: req.body.email});
      if(found){
        res.status(400).json({message:"user already exists"});
      }
      else{
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
        await db.collection("student").insertOne(req.body);
        res.status(200).json({message:"user registered"});
      }
    }    
    catch(error){
      console.log(error);
    }
  }
);

app.post('/login',async(req,res)=>{  
  try{
    let client = await mongoClient.connect(dbUrl);
    let db = client.db('student');
    let data = await db.collection("student").findOne({email: req.body.email});
    if(data){
      let isValid = await bcrypt.compare(req.body.password, data.password);
      if(isValid){
        res.status(200).json({message:"log-in successful"}); 
      }    
      else{
      res.status(400).json({message:"Sorry, log-in failed"});
    }
  }
    else{
     res.status(404).json({message:"user is not registered"});
    }
  }    
  catch(error){
    console.log(error);
  }
}
);
app.listen(port,()=>console.log('app listening at', port));