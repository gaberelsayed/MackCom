const {validationResult} = require("express-validator");

exports.getContact = (req,res)=>{
    console.log(req.user.getContact());
}

exports.postAddContact = (req,res,next)=>{
    const name = req.body.name;
    const mob = req.body.mob;
    const err = validationResult(req);
    if(!err.isEmpty()){
        return res.render("contact.ejs",{error:err.array()[0].msg,pageTitle:"Add Contact"});
    }
    req.user.addContact(name,mob).then(result=>{
        res.render("contact.ejs",{success:"Added Successfully",pageTitle:"Add Contact"});
    }).catch(err=>{
        if(err === "Already Exisit")
        return res.render("contact.ejs",{error:err,pageTitle:"Add Contact"});
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}


exports.getAddContact = (req, res) => {
    res.render("contact.ejs",{pageTitle:"Add Contact"});   
}

exports.getAddMsg =  (req, res) => {
    res.render("message.ejs",{pageTitle:"Add Message"});
}

exports.postAddMsg = (req,res,next)=>{
    const title = req.body.title;
    const msg = req.body.msg;
    req.user.addMessage(title,msg).then(result=>{
      res.render("message.ejs",{success:"Added Successfully",pageTitle:"Add Message"});
    })
    .catch(err=>{
        if(err === "Already Exisit")
        return res.render("message.ejs",{error:err,pageTitle:"Add Message"});
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}