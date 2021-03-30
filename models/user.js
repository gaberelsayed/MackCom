const date = require('date-and-time');
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
            mobile : {type:Number,min:10}
        }]
    },
    messageBox:{
        messages:[{
            title: {type:String},
            msg:{type:String} 
        }]
    },
    lastActiveAt: {type:String,default:null},
    totalSMS:{type:Number,default:0},
},{versionKey: false });

UserSchema.methods.setlastLogin = function () { 
    const now = new Date();
    this.lastActiveAt = date.format(now, 'DD/MM/YYYY HH:mm:ss'); 
    this.save();
 }

UserSchema.methods.getContact = function () {
    return this.phoneBook.contacts;
}

UserSchema.methods.updateContact = function(id,name,mob){
    const index = this.phoneBook.contacts.findIndex(c=>{
        return c._id.toString() == id.toString();
    })
    if(index < 0){
        return Promise.reject("Something went wrong try after sometime");
    }
    const check = this.phoneBook.contacts.filter(c=>{
        return c.mobile.toString() == mob.toString()
    })
    if(check.length > 0 ){
        this.phoneBook.contacts[index].name = name;
        return this.save();
    }else{
        this.phoneBook.contacts[index].mobile = mob;
        this.phoneBook.contacts[index].name = name;
        return this.save();    
    }
}

UserSchema.methods.addContact = function(name,mob){
    const checkNumber = this.phoneBook.contacts.findIndex(c=>{
       return c.mobile.toString() === mob.toString(); 
    })
    if(checkNumber>=0){
        return Promise.reject("Already Exisit");
    }
    const contact = [...this.phoneBook.contacts];
    contact.push({
        name:name,
        mobile:mob
    });
    const UpdateContact = {
        contacts : contact
    }
    this.phoneBook = UpdateContact;
    return this.save();
}
UserSchema.methods.removeContact = function(id){
    const UpdateContact = this.phoneBook.contacts.filter(c=>{
      return  c._id.toString() != id.toString();
    })
    this.phoneBook.contacts = UpdateContact;
    return this.save();
}

UserSchema.methods.searchContact = function (names) {
    const search = this.phoneBook.contacts.filter(c=>{
       return c.name.toString().toLowerCase().includes(names.toLowerCase());
    })
    return search;
}

UserSchema.methods.getMessage = function(){
    return this.messageBox.messages;
}

UserSchema.methods.addMessage = function(title,message){
    const checkmsg = this.messageBox.messages.findIndex(m=>{
        return m.msg.toString() === message.toString();
    })
    if(checkmsg >= 0){
        return Promise.reject("Already Exisit");
    }
    const messages = [...this.messageBox.messages];
    messages.push({
        title : title,
        msg: message
    });
    this.messageBox.messages = messages;
    return this.save();
} 

UserSchema.methods.deleteMessage = function (id) { 
    const UpdateMessage = this.messageBox.messages.filter(m=>{
        return  m._id.toString() != id.toString();
      })
      this.messageBox.messages = UpdateMessage;
      return this.save();
}

UserSchema.methods.updateMessage = function (id,title,msg) {
    const index = this.messageBox.messages.findIndex(m=>{
        return m._id.toString() == id.toString();
    })
    if(index < 0){
        return Promise.reject("Something went wrong try after sometime");
    }
    const check = this.messageBox.messages.filter(m=>{
        return m.msg.toString() == msg.toString()
    })
    if(check.length > 0 ){
        this.messageBox.messages[index].title = title;
        return this.save();
    }
    this.messageBox.messages[index].title = title;
    this.messageBox.messages[index].msg = msg;
    return this.save();
}

UserSchema.methods.sentSMS = function () { 
    return this.totalSMS
 }
UserSchema.methods.getMsgValue = function(id){
    const msgIndex = this.messageBox.messages.findIndex(m=>{
        return m._id.toString() == id.toString();
    })
    return this.messageBox.messages[msgIndex].msg
}

module.exports = mongoose.model("User", UserSchema);