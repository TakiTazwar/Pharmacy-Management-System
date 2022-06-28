const medData = require('../model/medicine');
const {success,failed}=require('../utils/message');
const HTTP_STATUS =require('../utils/httpStatus');
const Cart = require('../model/cart');
const paginationSkip=require("../utils/pagination");
const queryFetch=require("../utils/queryRegex");
const orderStatus=require("../utils/orderStatus");
const orderData=require("../model/order");
const { validationResult } = require('express-validator');

class CustomerController
{
    async getAllMedicine(req,res,next)
    {
        try
        {
            const searchQuery=queryFetch.queryFetchCustomer(req.query);
            const page = parseInt(req.query.page) >0 ? req.query.page : 1;
            const items =  parseInt(req.query.page)>0 ? req.query.items : 3;
            const {skipMed} = paginationSkip(page, items);

            const medicines = await medData.find(searchQuery).skip(skipMed).limit(items).exec();
            const totalItems = await medData.find(searchQuery).count().exec();
            res.status(HTTP_STATUS.OK).send(success("Got all medicine successfully",{totalItems,medicines}));
        }
        catch(error)
        {
            next(error);
        }
    }

    async getById(req,res,next)
    {
        try
        {
            const medId = req.params.medId;
            const foundMedicine = await medData.findById(medId).exec();

            if(foundMedicine)
            {
                res.status(HTTP_STATUS.OK).send(success("The medicine returned Successfully",foundMedicine));
            }
            else
            {
                res.status(HTTP_STATUS.OK).send(failed("Medicine not found"));
            }
        }
        catch(error)
        {
            next(error);
        }
    }

    async postCart(req, res, next)
    {
        try
        {
            const medicineId = req.body.medicineId;
            const userId=req.user._id;
            const cart = await Cart.findOne({userId: userId}).exec();
            if (cart) 
            {
                await cart.addToCart(medicineId);
            } 
            else 
            {
                const newCart = new Cart({userId: userId, medicines: []});
                await newCart.save();
                await newCart.addToCart(medicineId);
            }
            return res.status(HTTP_STATUS.OK).send(success('Medicine is added to cart'));
        }
        catch(error)
        {
            next(error);
        }
    }

    async showCart (req, res, next)
    {
        try 
        {
            const userId=req.user._id;
            const medicines = await Cart.findOne({userId: userId}).populate('userId','email _id').populate('medicines.med','name price _id').exec();
            return res.status(HTTP_STATUS.OK).send(success('Medicines are fetched from cart', medicines));
        } 
        catch (error) 
        {
            console.log(error);
            next(error);
        }
    }

    async deleteCart (req, res, next)
    {
        try 
        {
            const medicineId = req.params.medicineId;
            const userId=req.user._id;
            const cart = await Cart.findOne({ userId: userId }).exec();
            if (cart) 
            {
                const delState=await cart.deleteFromCart(medicineId);
                if(delState)
                {
                    return res.status(HTTP_STATUS.OK).send(success('Medicine is removed from cart'));
                }
                else
                {
                    return res.status(HTTP_STATUS.OK).send(failed('Medicine was not found'));
                }
            } 
            else 
            {
                return res.status(HTTP_STATUS.NOT_FOUND).send(failed("Cart doesn't exist!!"));
            }
        } 
        catch (error) {
            next(error);
        }
    }

    async removeCart(req,res,next)
    {
        try 
        {
            const medicineId = req.params.medicineId;
            const userId=req.user._id;
            const cart = await Cart.findOne({ userId: userId }).exec();
            if (cart) 
            {
                const delState=await cart.removeFromCart(medicineId);
                if(delState)
                {
                    return res.status(HTTP_STATUS.OK).send(success('Medicine is removed from cart'));
                }
                else
                {
                    return res.status(HTTP_STATUS.OK).send(failed('Medicine was not found'));
                }
            } 
            else 
            {
                return res.status(HTTP_STATUS.NOT_FOUND).send(failed("Cart doesn't exist!!"));
            }
        } 
        catch (error) 
        {
            next(error);
        }
    }

    async createOrder(req,res,next)
    {
        try 
        {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failed(errors.array()));
            }
            const customerId = req.user._id;
            const paymentmethod = req.body.paymentmethod;
            const address=req.body.address;

            const cart = await Cart.findOne({ userId: customerId }).exec();
            if(!cart)
            {
                return res.status(HTTP_STATUS.OK).send(success('Order Cannot be created without cart'));
            }
            const order= new orderData({address: address,payementMethod: paymentmethod,customerId: customerId,status: orderStatus.recieved});
            order.medicines=cart.medicines;
            order.save();
            Cart.findOneAndDelete({ userId: customerId });
            return res.status(HTTP_STATUS.OK).send(success('Order is added successfully'));

        } 
        catch (error) 
        {
            next(error);
        }
    }

    async showOrder(req,res,next)
    {
        try 
        {
            const userId=req.user._id;
            let orders = await orderData.find({userId: userId}).populate('medicines.med','name price imageUrl _id')
            .populate('deliveredBy','name phoneNumber -_id')
            .exec();
            orders=orders.filter(order=>{
                if(order.status==orderStatus.recieved||order.status==orderStatus.accepted )
                {
                    return true;
                }
            })
            
            return res.status(HTTP_STATUS.OK).send(success('Medicines are fetched for the customer', orders));
        } 
        catch (error) 
        {
            console.log(error);
            next(error);
        }
    }

    async cancelOrder(req,res,next)
    {
        const orderId = req.params.orderId;
        const deletedOrder = await orderData.findById(orderId).exec();
        console.log(deletedOrder);
        if(deletedOrder && deletedOrder.status==orderStatus.recieved)
        {

            const del = await orderData.findOneAndDelete({_id:orderId}).exec();
            return res.status(HTTP_STATUS.OK).send(success("Order is cancelled"));
        }

        return res.status(HTTP_STATUS.OK).send(failed("Order cannot be cancelled after being accepted"));
    
    }
}

module.exports = new CustomerController();