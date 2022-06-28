const { body } = require('express-validator');
const userData = require('../model/user');

const validator = {
    createProduct: [
        body('name')
            .notEmpty()
            .withMessage('Name is required')
            .isString()
            .withMessage('name must be string!'),
        body('price')
            .notEmpty()
            .withMessage('Price is required')
            .isNumeric()
            .withMessage('Price must be number'),
        body('category')
            .notEmpty()
            .withMessage('category is required')
            .isString()
            .withMessage('category must be string!'),
        body('company')
            .notEmpty()
            .withMessage('company is required')
            .isString()
            .withMessage('company must be string!'),
        body('license')
            .notEmpty()
            .withMessage('license is required')
            .isString()
            .withMessage('license must be string!'),
        body('country')
            .notEmpty()
            .withMessage('country is required')
            .isString()
            .withMessage('country must be string!')
    ],
    updateProduct: [
        body('name').optional().isString().withMessage('name must be string!'),
        body('price').optional().isNumeric().withMessage('Price must be number'),
        body('category').optional().isString().withMessage('category must be string'),
        body('company').optional().isString().withMessage('company must me string'),
        body('license').optional().isString().withMessage('license must me string'),
        body('country').optional().isString().withMessage('country must me string'),
        body('imageUrl').optional().isString().withMessage('imageUrl must me string')
    ],
    addCart:[
        body('medicineId').isString().withMessage('Please give a valid UserId'),
    ],
    createOrder:[
        body('paymentmethod').isString().withMessage('Payment Method must be string'),
        body('address').isString().withMessage('Payment Method must be string')
    ],
    registration: [
        body('email')
            .notEmpty()
            .withMessage('email is required')
            .isEmail()
            .withMessage('email must be valid!')
            .custom(async(value) => {
                const foundUser = await userData.find({email:value}).exec();
                if(foundUser.length>0)
                {
                    return Promise.reject("User email already exists");
                }
                // const user = await User.findOne({ email: value }).exec();
                // if (user) {
                //     return Promise.reject("E-mail is already exists!");
                // }
                return true;
            }),
        body('type')
            .notEmpty()
            .withMessage('type is required')
            .isString()
            .withMessage('type must be string!'),
        body('phoneNumber')
            .notEmpty()
            .withMessage('phoneNumber is required')
            .isNumeric()
            .withMessage('phoneNumber must be string!'),
        body('name')
            .notEmpty()
            .withMessage('name is required')
            .isString()
            .withMessage('name must be string!'),
        body('password')
            .notEmpty()
            .withMessage('password is required')
            .isString()
            .withMessage('password must be string!'),

        body('confirm_password')
            .notEmpty()
            .withMessage('confirm_password is required')
            .isString()
            .withMessage('confirm_password must be string!')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                        throw new Error("Password doensn't match!");
                    }
                    return true;
            }),
    ],
    login: [
        body('password').notEmpty().withMessage('password is required').isString().withMessage('password must be string!'),
        body('email').notEmpty().withMessage('email is required').isEmail().withMessage('email must be valid!')
    ],
    resetMailPassword: body('email').isEmail().withMessage('Please give a valid email'),
    resetPassword: [
        body("resetToken").isString().withMessage("Token is required and must be string"),
        body("userId").trim().isString().withMessage("userId is required and must be string"),
        body("password").isLength({ min: 6 }).withMessage("Passowrd must be at least 6 character"),
        body("confirmPassword").custom((value, { req }) => {
            if (value !== req.body.password) {
              throw new Error("Password doesn't match!");
            }
            return true;
          }),
      ],
    validOrderId: body('orderId').isString().withMessage('Order ID must be string')
};

module.exports = validator;