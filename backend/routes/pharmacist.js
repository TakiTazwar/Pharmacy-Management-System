const express = require('express');
const router = express.Router();
const PharmacistController=require('../controller/pharmacist');
const validator = require('../middlewares/validation');
const upload = require('../middlewares/addMedicineMulter');
const auth = require("../middlewares/auth");



router.post('/addmedicine',auth.checkAuth,auth.isAdmin,upload.single('productImage'), validator.createProduct,PharmacistController.addMedicine);

router.put('/editmedicine/:medId',auth.checkAuth,auth.isAdmin,upload.single('productImage'),validator.updateProduct,PharmacistController.editMedicine);

router.delete('/deleteBook/:medId',auth.checkAuth,auth.isAdmin,PharmacistController.deleteMedicine);



module.exports=router;