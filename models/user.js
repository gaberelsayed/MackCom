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
    }
});

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
UserSchema.methods.removeContact = function(mob){
    const UpdateContact = this.phoneBook.contacts.filter(m=>{
      return  m.mobile.toString() != mob.toString();
    })
    this.phoneBook.contacts = UpdateContact;
    return this.save();
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

module.exports = mongoose.model("User", UserSchema);