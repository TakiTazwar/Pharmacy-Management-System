const mongoose = require('mongoose');

const medicineSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    license: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
},{collection: 'medicines'})

const medData=mongoose.model('Medicine',medicineSchema);



module.exports = medData;