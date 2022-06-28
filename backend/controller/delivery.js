const medData = require('../model/medicine');
const {success,failed}=require('../utils/message');
const HTTP_STATUS =require('../utils/httpStatus');
const paginationSkip=require("../utils/pagination");
const orderStatus=require("../utils/orderStatus");
const orderData=require("../model/order");
const queryFetch=require("../utils/queryRegex");
const { validationResult } = require('express-validator');

class DeliveryController
{
    async acceptOrder(req,res,next)
    {
        try 
        {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failed(errors.array()));
            }
            const deliveredBy = req.user._id;
            const orderId=req.body.orderId;
            const acceptedOrder = await orderData.findOne({ _id: orderId }).exec();
            if(!acceptedOrder)
            {
                return res.status(HTTP_STATUS.OK).send(failed('Order is not found'));
            }
            acceptedOrder.deliveredBy=deliveredBy;
            acceptedOrder.status=orderStatus.accepted;
            acceptedOrder.save();
            return res.status(HTTP_STATUS.OK).send(success('Order is Accepted successfully'));

        } 
        catch (error) 
        {
            next(error);
        }
    }

    async deliverOrder(req,res,next)
    {
        try 
        {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failed(errors.array()));
            }
            const deliveredBy = req.user._id;
            const orderId=req.body.orderId;
            const deliveredOrder = await orderData.findOne({ _id: orderId,deliveredBy:deliveredBy}).exec();
            if(!deliveredOrder)
            {
                return res.status(HTTP_STATUS.OK).send(failed('Order is not found'));
            }
            deliveredOrder.status=orderStatus.delivered;
            deliveredOrder.save();
            return res.status(HTTP_STATUS.OK).send(success('Order is Delivered successfully'));

        } 
        catch (error) 
        {
            next(error);
        }
    }

    async showRecievedOrder(req,res,next)
    {
        try 
        {

            const searchQuery=queryFetch.queryFetchDelivery(req.query);
            searchQuery.status=orderStatus.recieved;
            let orders = await orderData.find(searchQuery).populate('medicines.med','name price imageUrl _id')
            .populate('customerId','name phoneNumber -_id')
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

    async showAcceptedOrder(req,res,next)
    {
        try 
        {
            const deliverBy=req.user._id;
            let orders = await orderData.find({deliveredBy:deliverBy,status:orderStatus.accepted}).populate('medicines.med','name price imageUrl _id')
            .populate('customerId','name phoneNumber -_id')
            .exec();          
            
            return res.status(HTTP_STATUS.OK).send(success('Medicines are fetched for the customer', orders));
        } 
        catch (error) 
        {
            console.log(error);
            next(error);
        }
    }


}

module.exports = new DeliveryController();