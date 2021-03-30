const User = require("../models/user");
const bcrypt = require('bcrypt');
const {validationResult} = require("express-validator");
const crypto = require("crypto")
const mailer = require("../utils/mailer");

exports.postRegister = (req, res,next) => {
    const name = req.body.fullname;
    const email = req.body.email;
    const password = req.body.password;
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.render('login.ejs', {
            error: error.array()[0].msg,
            pageTitle: 'Login & SignUp'
        });
    }
    bcrypt.hash(password, 12)
        .then(hashPassword => {
            let user = new User({
                name: name,
                email: email,
                password: hashPassword
            });
            return user.save()
        })
        .then(result => {
            return res.render('login.ejs', {
                pageTitle: 'Login & SignUp',
                success: 'Successfully Registered'
            });
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postLogin = (req, res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.render('login.ejs', {
            error: error.array()[0].msg,
            pageTitle: 'Login & SignUp'
        });
    }
    User.findOne({
            email: email
        }).then(user => {
            bcrypt.compare(password, user.password).then(match => {
                if (match) {
                    req.session.user = user;
                    req.session.lastLogin = user.lastActiveAt;
                    return req.session.save(err => {
                        user.setlastLogin();
                        if(req.session.redirect)
                        {
                            let redirect = req.session.redirect;
                            delete req.session.redirect;
                            return  res.redirect(redirect);
                        }
                        res.redirect('/user');
                    });
                } else {
                    return res.render('login.ejs', {
                        error: "Invalid Password,To reset click on forget password",
                        pageTitle: 'Login & SignUp'
                    });
                }
            }).catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getReset = (req, res) => {
    res.render('reset.ejs', {
        pageTitle: 'Reset Password'
    });
}

exports.postReset = (req, res, next) => {
    const email = req.body.email;
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.render('reset.ejs', {
            error: error.array()[0].msg,
            pageTitle: 'Reset'
        });
    }
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            return res.redirect('/auth/resetPassword');
        }
        const token = buffer.toString('hex');
        User.findOne({
                email: email
            }).then(user => {
                user.resetToken = token;
                user.resetTokenExpire = Date.now() + 360000;
                return user.save();
            })
            .then(() => {
                let message = {
                    from: 'markCom@test.com', // Sender address
                    to: email, // List of recipients
                    subject: 'Password reset ! | MarkCom', // Subject line
                    html: `
                <p>To reset Password :</p>
                <p>Click this <a href ="${BaseURL}/auth/updatePassword/${token}" >Link</a> to reset password</p>
                `
                };
                return mailer.sendMail(message);
            })
            .then(() => {
                req.flash("success", "Check Mail to reset password");
                return res.redirect('/auth');
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            })
    });
}

exports.getUpdatePassword = (req, res,next) => {
    const token = req.params.token;
    User.findOne({
            resetToken: token,
            resetTokenExpire: {
                $gt: Date.now()
            }
        })
        .then(user => {
            if(user){
            res.render('updatepassword.ejs', {
                pageTitle: "Update Password",
                passwordToken: token
            });
        }else{
            req.flash("error","Invalid link or link get Expired");
            res.redirect('/auth');   
        }
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.postUpdatePassword = (req, res,next) => {
    const token = req.body.passwordToken;
    const password = req.body.newpassword;
    let resetUser;
    User.findOne({
            resetToken: token,
            resetTokenExpire: {$gt: Date.now()}
        })
        .then(user => {
        if(user){
            resetUser = user;
            return bcrypt.hash(password, 12)
        }
        res.redirect('/auth');
        })
        .then(hashPassword => {
            resetUser.password = hashPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpire = undefined;
            return resetUser.save()
        })
        .then(result => {
            req.flash("success", "Password Sucessfully Updated")
            res.redirect('/auth');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getLogin = (req, res) => {
    if(req.session.user){
        req.session.lastLogin = req.user.lastActiveAt;
        req.user.setlastLogin();
        if(req.session.redirect)
            return res.redirect(req.session.redirect);
        return res.redirect('/user');
    }
    let message = req.flash("success");
    let Errormessage = req.flash("error");
    if(message.length ===0){
        message = false;
    }
    if(Errormessage.length ===0){
        Errormessage = false;
    }
    res.render("login.ejs", {
        pageTitle: 'Login & Signup',
        success : message,
        error : Errormessage
    });
}


exports.logout = (req,res,next)=>{
    req.session.destroy(err=>{
            if(!err)
                return res.redirect('/auth');
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
    })
}