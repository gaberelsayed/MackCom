const express = require('express');
const router = express.Router();
const auth = require("../controllers/auth");
const {check,body} = require("express-validator");
const User = require("../models/user");

router.get('/', auth.getLogin);

router.post('/register', [check('email').isEmail()
    .withMessage("Enter valid email")
    .custom((value, {req}) => {
        return User.findOne({
            email: value
        }).then(user => {
            if (user) {
                return Promise.reject("Email Already exists");
            }
        });
    }).trim(),
    body("password").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, "i").withMessage("Password must contain atleast 1 lowecase,uppercase,number,symbol and lenght should be greater than 8")
], auth.postRegister);

router.post('/login',[body('email').isEmail().withMessage("Enter valid email").custom((value, {req}) => {
    return User.findOne({
        email: value
    }).then(user => {
        if (!user) {
            return Promise.reject("Email does not exists");
        }
    });
}),
body("password").isLength({min:8}).withMessage("Password lenght should be greater than 8")]
,auth.postLogin);

router.get('/resetPassword',auth.getReset);

router.post('/resetPassword',[body('email').isEmail().withMessage("Enter a valid email").custom((value, {req}) => {
    return User.findOne({
        email: value
    }).then(user => {   
        if (!user) {
            return Promise.reject("Email does not exists");
        }
    });
}).trim()],auth.postReset);

router.get('/updatePassword/:token', auth.getUpdatePassword);

router.post('/updatePassword', auth.postUpdatePassword);

router.get('/logout',auth.logout);

module.exports = router;