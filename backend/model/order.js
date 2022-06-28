const mongoose = require('mongoose');

const orderSchema=new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    medicines: [
        {
            med: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Medicine',
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    address: {
        type: String,
        required: true
    },
    payementMethod: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    deliveredBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
},{collection: 'orders'})

const orderData=mongoose.model('Order',orderSchema);



module.exports = orderData;