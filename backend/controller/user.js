const userData = require('../model/user');
const {success,failed}=require('../utils/message');
const HTTP_STATUS =require('../utils/httpStatus');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const sendMail = require('../config/mail');
const crypto = require('crypto');
const ejs = require('ejs');
const path = require('path');
const { promisify } = require('util');
const ejsRenderFile = promisify(ejs.renderFile);

class UserController
{
    async registration(req,res,next)
    {
        try
        {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failed(errors.array()));
            }
            const email = req.body.email;
            const type = req.body.type;
            const phoneNumber = req.body.phoneNumber;
            const name=req.body.name;
            const password = await bcrypt.hash(req.body.password, 5);
            const newUser = new userData({email,password,type,phoneNumber,name});
            newUser.verifyToken = crypto.randomBytes(32).toString('hex');
            newUser.verifyExpire = Date.now() + 60* 60 * 1000;
            await newUser.save();

            const userInfo = {
                _id: newUser._id,
                email: newUser.email,
                type: newUser.type,
                name: newUser.name,
                phoneNumber: newUser.phoneNumber,
                admin: newUser.admin,
                verify:newUser.verify,
            };

            const jwtToken = jwt.sign(userInfo, process.env.JWT_SECRET_KEY);
            const resData = {
                access_token: jwtToken,
                ...userInfo
            }

            const verifyLink="http://localhost:5000/user/verifyemail/"+newUser.verifyToken+"/"+userInfo._id;

            const htmlStr = await ejsRenderFile(
                path.join(__dirname, '..', 'mails', 'verifyMail.ejs'),
                { name: userInfo.name, link: verifyLink }
            );

            sendMail({
                from: "Shop <shop@gmail.com>",
                to: email,
                subject: " Verify your mail",
                html: htmlStr
            });

            res.status(HTTP_STATUS.OK).send(success('User has been created',resData));

        }
        catch(error)
        {
            next(error);
        }
    }

    async login(req,res,next)
    {
        try
        {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failed(errors.array()));
            }
            const email = req.body.email;
            const password = req.body.password;
            const foundUser = await userData.findOne({email:email}).exec();
            if(foundUser)
            {
                const passMatch = await bcrypt.compare(password, foundUser.password);
                if(passMatch)
                {
                    const userData = {
                        _id: foundUser._id,
                        email: foundUser.email,
                        type: foundUser.type,
                        name: foundUser.name,
                        phoneNumber: foundUser.phoneNumber,
                        admin: foundUser.admin,
                        verify:foundUser.verify,
                    };
                    const jwtToken = jwt.sign(userData, process.env.JWT_SECRET_KEY);
                    const resData = {
                        access_token: jwtToken,
                        ...userData
                    }
                    res.status(HTTP_STATUS.OK).send(success("Login Succes",resData));
                }
                else
                {
                    res.status(HTTP_STATUS.OK).send(failed("Login Fail"));
                }
            }
            else
            {
                res.status(HTTP_STATUS.OK).send(failed("User doesn't exists"));
            }
        }
        catch(error)
        {
            next(error);
        }
    }

    async resetPasswordMail(req,res,next)
    {
        try 
        {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failed(errors.array()));
            }
            const email = req.body.email;
            const user = await userData.findOne({ email: email });
            if (!user) {
                return res.status(HTTP_STATUS.NOT_FOUND).send(failed("User doen't exist!"));
            }

            const resetToken = crypto.randomBytes(32).toString('hex');
            user.resetToken = resetToken;
            user.resetExpire = Date.now()+1000*5*60*60;
            console.log(user.resetExpire);
            await user.save();

            const resetUrl = path.join(
                process.env.FRONTEND_URI,
                'user/passwordreset',
                resetToken,
                user._id.toString()
            );

            const htmlStr = await ejsRenderFile(
                path.join(__dirname, '..', 'mails', 'resetPassword.ejs'),
                { name: user.email, link: resetUrl }
            );

            sendMail({
                from: "Medicine Shop <shopmedicine@anymail.com>",
                to: email,
                subject: "Reset Your Password",
                html: htmlStr
            });

            return res.status(HTTP_STATUS.OK).send(success('Reset Password link is sent!'));


            console.log(user);

        } 
        catch (error) 
        {
            next(error);
        }
    }

    async resettingPassword(req,res,next)
    {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failed(errors.array()));
        }
        const resetToken = req.body.resetToken;
        const userId = req.body.userId;
        const password = req.body.password;

        const user = await userData.findOne({ _id: userId, resetExpire: { $gt: Date.now() } });

        if (!user) 
        {
            return res.status(HTTP_STATUS.FORBIDDEN).send(failed('Wrong User Info'));
        }
        else if(user.resetToken.toString() !== resetToken.toString())
        {
            return res.status(HTTP_STATUS.FORBIDDEN).send(failed('Invalid reset token'));
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetToken = undefined;
        user.resetExpire = undefined;
        await user.save();

        return res.status(HTTP_STATUS.OK).send(success('Reset password is successfull!'));

    }

    async verifyMail(req, res, next)
    {
        try
        {
            
            const verifyToken=req.params.verifytoken;
            const id=req.params.id;
            const user = await userData.findOne({ _id: id,verifyExpire: { $gt: Date.now() } }).exec();
            if (!user) 
            {
                return res.status(HTTP_STATUS.FORBIDDEN).send(failed('Wrong User Info'));
            }
            else if(user.verifyToken.toString() !== verifyToken.toString())
            {
                return res.status(HTTP_STATUS.FORBIDDEN).send(failed('Invalid reset token'));
            }
            user.verify=true;
            user.verifyToken=undefined;
            user.verifyExpire=undefined;
    
            await user.save();
            
            return res.status(HTTP_STATUS.OK).send(success('User is verified'));

        }
        catch (error) {
            console.log(error);
            next(error);
        }

    } 

    async verifyRefresh(req,res,next)
    {
        const id=req.params.id;
        const user = await userData.findOne({ _id: id,verify:false}).exec();
        if (!user) 
        {
            return res.status(HTTP_STATUS.FORBIDDEN).send(failed('Wrong User Info'));
        }
        user.verifyToken = crypto.randomBytes(32).toString('hex');
        user.verifyExpire = Date.now() + 60* 60 * 1000;
        user.save();

        const verifyLink="http://localhost:5000/user/verifyemail/"+user.verifyToken+"/"+user._id;
        const htmlStr = await ejsRenderFile(
            path.join(__dirname, '..', 'mails', 'verifyMail.ejs'),
            { name: user.email, link: verifyLink }
        );

        sendMail({
            from: "Shop <shop@gmail.com>",
            to: user.email,
            subject: " Verify your mail",
            html: htmlStr
        });

        res.status(HTTP_STATUS.OK).send(success('Verify Email Refreshed'));


    }

}

module.exports = new UserController();