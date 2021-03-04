const express = require('express');
const router = express.Router();
const {body} = require("express-validator");
const userController = require("../controllers/user");
const isAuth = require("../controllers/checkauth");

router.get('/home',isAuth,userController.getContact)

router.get('/add-contact',isAuth, userController.getAddContact);

router.post('/add-contact', isAuth,[body('name').isAlpha("en-IN",{ignore:" "}).withMessage("Enter name in correct format").trim(),
    body('mob',"Enter correct mobile number").isLength({max:10,min:10}).isNumeric()], userController.postAddContact);

router.get('/add-message', isAuth,userController.getAddMsg);

router.post('/add-message', isAuth,userController.postAddMsg);

module.exports = router;