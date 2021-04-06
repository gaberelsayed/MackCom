require('dotenv').config({ path: '../.env'});
const { validationResult} = require("express-validator");
const smsApi = require("../utils/sendSMS");
const bcrypt = require('bcrypt');
const User = require("../models/user");
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2
const oauth2Client = new OAuth2(process.env.GOOGLE_ID,process.env.GOOGLE_SECRET,process.env.GOOGLE_REDIRECT);
const scopes = ['https://www.googleapis.com/auth/contacts.readonly'];

exports.getimportContactURL = (req,res)=>{
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
      });
     res.redirect(url);
}

exports.importContact = (req,res)=>{
    if (req.query.error) {
        req.flash("error","Please give permission to import contact");
        // The user did not give us permission.
        return res.redirect('/user');
      } else {
        oauth2Client.getToken(req.query.code, function(err, token) {
          if (err){
            req.flash("error","Something Went wrong try after sometime");
            return res.redirect('/');    
          }
          oauth2Client.setCredentials(token);
          const service = google.people('v1');
          service.people.connections.list({
              auth: oauth2Client,
              resourceName:"people/me",
              personFields: 'names,phoneNumbers',
              pageSize:200
          },(err,result)=>{
            if (err){
                req.flash("error","Something Went wrong try after sometime");
                return res.redirect('/');    
              } 
            const connections = result.data.connections;
            let notAdded = 0;
            let added = 0;
            connections.forEach(contact=>{
                    let name = contact.names[0].displayName;
                    let number = contact.phoneNumbers[0].value;
                    number = number.replace(/\D/g, '').slice(-10);
                    if (name.length>0 && number.length == 10){
                        req.user.addContact(name, number).then(result => {
                            added++;  
                            // console.log(added);
                        }).catch(err => {
                            notAdded++;
                            // console.log(notAdded);
                        })
                    }else{
                        notAdded++;
                    }
                })
             res.redirect('/user/view-contact');
          });
        });
    }

}

exports.getdashBoard = (req, res) => {
    const contact = req.user.getContact();
    const msg = req.user.getMessage();
    const sms = req.user.totalSMS;
    let errmsg = req.flash('error');
    if(errmsg.length == 0){
        errmsg = false;
    }
    res.render("dashboard.ejs", {
        pageTitle: "Dashboard",
        lastlogin: req.session.lastLogin,
        totalcontact: contact.length,
        totalmsg: msg.length,
        totalsms: sms,
        error:errmsg
    });
}

exports.postContact = (req, res) => {
    const contact = req.user.getContact();
    const msg = req.user.getMessage();
    res.status(200).json({list:contact,msg:msg,csrfToken: req.csrfToken()});
}

exports.getContact = (req, res) => {
    const contact = req.user.getContact();
    const msg = req.user.getMessage();
    res.render("view-contact.ejs", {pageTitle: "View Contact", message: msg,contact:contact});
}

exports.deleteContact = (req,res,next)=>{
    const contactId = req.params.contactId
    req.user.removeContact(contactId)
    .then(()=>{
        res.status(200).json({success:"Deleted..."});
    })
    .catch(err=>{
        res.status(500).json({error:"Unable to delete, Try after Sometime"});
    })
}

exports.searchContact = (req,res)=>{
    const name = req.params.name;
    const result = req.user.searchContact(name);
    const msg = req.user.getMessage();
    res.status(200).json({list:result,msg:msg,csrfToken: req.csrfToken()});
}

exports.postAddContact = (req, res, next) => {
    const name = req.body.field1;
    const mob = req.body.field2;
    const err = validationResult(req);
    if (!err.isEmpty()) {
        // return res.render("contact.ejs",{error:err.array()[0].msg,pageTitle:"Add Contact"});
        return res.status(422).json({
            error: err.array()[0].msg
        });
    }
    req.user.addContact(name, mob).then(result => {
        // res.render("contact.ejs",{success:"Added Successfully",pageTitle:"Add Contact"});
        res.status(200).json({
            success: "Contact added Successfully"
        });
    }).catch(err => {
        if (err === "Already Exisit")
            return res.status(409).json({
                error: "Contact Already Exisits"
            });
        // return res.render("contact.ejs",{error:err,pageTitle:"Add Contact"});
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}

exports.getAddContact = (req, res) => {
    res.render("contact.ejs", {
        pageTitle: "Add Contact"
    });
}

exports.updateContact = (req,res)=>{
    const name = req.body.name
    const mob = req.body.mob
    const id = req.params.contactId
    const err = validationResult(req);
    if (!err.isEmpty()) {
        // return res.render("contact.ejs",{error:err.array()[0].msg,pageTitle:"Add Contact"});
        return res.status(422).json({
            error: err.array()[0].msg
        });
    }
    req.user.updateContact(id,name,mob)
    .then(result=>{res.status(200).json({success: "Updated"});})
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}

exports.getAddMsg = (req, res) => {
    res.render("message.ejs", {
        pageTitle: "Add Message"
    });
}

exports.getMsg = (req,res)=>{
    const msg = req.user.getMessage();
    res.render("view-message.ejs",{pageTitle:"View Message",message:msg});
}

exports.postAddMsg = (req, res, next) => {
    const title = req.body.field1;
    const msg = req.body.field2;
    const err = validationResult(req);
    // console.log(err);
    if (!err.isEmpty()) {
        // return res.render("contact.ejs",{error:err.array()[0].msg,pageTitle:"Add Contact"});
        return res.status(422).json({
            error: err.array()[0].msg
        });
    }
    req.user.addMessage(title, msg).then(result => {
            //   res.render("message.ejs",{success:"Added Successfully",pageTitle:"Add Message"});
            res.status(200).json({
                success: "Added to your Message Successfully"
            });
        })
        .catch(err => {
            if (err === "Already Exisit")
                return res.status(409).json({
                    error: "Message Already Exisits"
                });
            // return res.render("message.ejs",{error:err,pageTitle:"Add Message"});
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.deleteMessage = (req,res)=>{
    const msgId = req.params.msgId
    req.user.deleteMessage(msgId)
    .then(()=>{
        res.status(200).json({success:"Deleted..."});
    })
    .catch(err=>{
        res.status(500).json({error:"Unable to delete, Try after Sometime"});
    })
}

exports.updateMessage = (req,res)=>{
    const title = req.body.title
    const msg = req.body.msg
    const id = req.params.msgId
    const err = validationResult(req);
    if (!err.isEmpty()) {
        // return res.render("contact.ejs",{error:err.array()[0].msg,pageTitle:"Add Contact"});
        return res.status(422).json({
            error: err.array()[0].msg
        });
    }
    req.user.updateMessage(id,title,msg)
    .then(result=>{res.status(200).json({success: "Updated"});})
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}

exports.sendMsg = (req, res) => {
    const msgId = req.body.msgId;
    const mob = req.body.mob;
    const msg = req.user.getMsgValue(msgId);
    smsApi(mob, msg).then(result => {
        req.user.updateSMS();
        return res.status(200).json({success: "Sent"});
    }).catch(err=>{
        return res.status(500);
    })
}

exports.updatePassword = (req,res)=>{
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const err = validationResult(req);
    if (!err.isEmpty()) {
        // console.log(err);
        return res.status(422).json({error: err.array()[0].msg});
    }
    const userId = req.user._id;
    bcrypt.compare(oldPassword, req.user.password).then(match=>{
        if(!match){
            return res.status(422).json({error:"Enter your correct old password"});
        }
        bcrypt.hash(newPassword, 12).then(hash=>{
            return User.findByIdAndUpdate(userId,{password:hash})
        }).then(result=>{
            console.log("change");
            return res.status(200).json({success:"Succesfully Updated"});
        }).catch(err=>{
           return res.status(500);
        })
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}