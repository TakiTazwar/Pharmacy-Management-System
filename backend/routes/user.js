const express = require('express');
const router = express.Router();
const UserController=require('../controller/user');
const validator = require('../middlewares/validation');


router.post('/registration' ,validator.registration, UserController.registration);

router.post('/login',validator.login,UserController.login);

router.post('/resetpasswordmail', validator.resetMailPassword,UserController.resetPasswordMail);

router.post('/resetpassword', validator.resetPassword,UserController.resettingPassword);

router.get('/verifyemail/:verifytoken/:id',UserController.verifyMail);

router.get('/refreshVerify/:id',UserController.verifyRefresh);


module.exports=router;