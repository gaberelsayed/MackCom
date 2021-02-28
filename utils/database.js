require('dotenv').config({path: './.env'});
const mongoose = require('mongoose');
const uri = "mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASS+"@cluster0.gvwj0.mongodb.net/MarkComDB";
mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true },(err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("connected to db");
    }
});
mongoose.set("useCreateIndex",true);
  