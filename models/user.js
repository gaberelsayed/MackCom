const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name: {type:String,required:true},
    email: {type:String,required:true},
    password: {type:String,required:true},
    resetToken: {type:String},
    resetTokenExpire:{type:String},
    phoneBook:{
        contacts:[{
            name: {type:String},
            mobile : {type:Number,min:10,max:12}
        }]
    }
});

module.exports = mongoose.model("User", UserSchema);