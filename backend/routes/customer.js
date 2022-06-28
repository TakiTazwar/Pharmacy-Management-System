const express = require('express');
const router = express.Router();
const customerController=require('../controller/customer');
const auth = require("../middlewares/auth");
const validator = require('../middlewares/validation');


router.get('/viewallmedicine', customerController.getAllMedicine);

router.get('/viewmedicine/:medId',customerController.getById);

router.get('/medicineCategory/',customerController.getById);

router.post('/addcart',auth.checkAuth,auth.isVerified, customerController.postCart);

router.delete('/removecart/:medicineId',auth.checkAuth,auth.isVerified,customerController.removeCart);

router.delete('/deletecart/:medicineId',auth.checkAuth,auth.isVerified,customerController.deleteCart);

router.get('/showcart',auth.checkAuth,auth.isVerified,customerController.showCart);

router.post('/addorder',auth.checkAuth,auth.isVerified, validator.createOrder ,customerController.createOrder);

router.get('/showorder',auth.checkAuth,auth.isVerified, customerController.showOrder);

router.delete('/cancelorder/:orderId',auth.checkAuth,auth.isVerified,customerController.cancelOrder);



module.exports=router;