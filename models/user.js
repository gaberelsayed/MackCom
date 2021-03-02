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
    },
    messageBox:{
        messages:[{
            msg:{type:String} 
        }]
    }
});

UserSchema.methods.addContact = (name,mob)=>{
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
    this.phoneBook.contacts = contact;
    return this.save();
}
UserSchema.methods.removeContact = (mob)=>{
    const UpdateContact = this.phoneBook.contacts.filter(m=>{
      return  m.mobile.toString() != mob.toString();
    })
    this.phoneBook.contacts = UpdateContact;
    return this.save();
}
UserSchema.methods.addMessage = (msg)=>{
    const messages = [...this.messageBox.messages];
    messages.push({
        msg:msg
    });
    return this.save();
} 

module.exports = mongoose.model("User", UserSchema);