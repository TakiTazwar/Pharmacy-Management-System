const express = require('express');
const router = express.Router();
const deliveryController=require('../controller/delivery');
const auth = require("../middlewares/auth");
const validator = require('../middlewares/validation');


router.post('/acceptorder',auth.checkAuth,auth.isVerified, validator.validOrderId, deliveryController.acceptOrder);

router.post('/deliverorder',auth.checkAuth,auth.isVerified, validator.validOrderId, deliveryController.deliverOrder);

router.get('/showPendingItem',auth.checkAuth,auth.isVerified,  deliveryController.showRecievedOrder);

router.get('/showAcceptedItem',auth.checkAuth,auth.isVerified,  deliveryController.showAcceptedOrder);


module.exports=router;