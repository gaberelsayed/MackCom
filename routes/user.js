const express = require('express');
const router = express.Router();
const {body} = require("express-validator");
const userController = require("../controllers/user");
const isAuth = require("../controllers/checkauth");

router.get('/add-contact',isAuth, userController.getAddContact);

router.post('/add-contact', isAuth, userController.postAddContact);

router.get('/add-message', isAuth,userController.getAddMsg);

router.post('/add-message', isAuth,userController.postAddMsg);

module.exports = router;