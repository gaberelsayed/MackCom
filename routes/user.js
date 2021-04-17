const express = require('express');
const router = express.Router();
const {body} = require("express-validator");
const userController = require("../controllers/user");
const isAuth = require("../controllers/checkauth");

router.get('/',isAuth,userController.getdashBoard)

router.get('/add-contact',isAuth, userController.getAddContact);

router.post('/add-contact', isAuth,[body('field1').isAlpha("en-IN",{ignore:" "}).withMessage("Enter name in correct format").trim(),
    body('field2',"Enter correct mobile number").isLength({max:10,min:10}).isNumeric()], userController.postAddContact);

router.get('/add-message', isAuth,userController.getAddMsg);

router.post('/add-message', isAuth, [body('field2').isLength({min:5}).withMessage("Message should be atleast 5 character"),body('field1').isLength({min:5}).withMessage("Message Title should be atleast 5 character")],userController.postAddMsg);

router.get('/view-contact', isAuth, userController.getContact);

router.post('/view-contact', isAuth, userController.postContact);

router.post('/sendMsg', isAuth, userController.sendMsg);

router.post('/sendMsgToAll', isAuth, userController.sendMsgAll);

router.delete('/delete-contact/:contactId', isAuth, userController.deleteContact);

router.patch("/update-contact/:contactId", isAuth,[body('name').isAlpha("en-IN",{ignore:" "}).withMessage("Enter name in correct format").trim(),
body('mob',"Enter correct mobile number").isLength({max:10,min:10}).isNumeric()] , userController.updateContact);

router.post('/search-contact/:name', isAuth,userController.searchContact);

router.get("/view-message", isAuth, userController.getMsg)

router.delete('/delete-message/:msgId', isAuth, userController.deleteMessage);

router.patch('/update-message/:msgId', isAuth, [body('msg').isLength({min:5}).withMessage("Message should be atleast 5 character"),body('title').isLength({min:5}).withMessage("Message Title should be atleast 5 character")] , userController.updateMessage);

router.patch("/updatePassword", isAuth, [body("newPassword").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, "i").withMessage("Password must contain atleast 1 lowecase,uppercase,number,symbol and lenght should be greater than 8"),body("oldPassword").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, "i").withMessage("Password must contain atleast 1 lowecase,uppercase,number,symbol and lenght should be greater than 8")],userController.updatePassword)

router.get('/getContactList',isAuth,userController.importContact);

router.get('/importContact',isAuth,userController.getimportContactURL);


module.exports = router;