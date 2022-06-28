const res = require('express/lib/response');
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
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
},{collection: 'carts'});

cartSchema.methods.addToCart = async function (medicineIdParam) {
    try {
        const medicineIndex = this.medicines.findIndex(
            (singeMed) => singeMed.med.toString() === medicineIdParam.toString()
        );
        if (medicineIndex >= 0) {
            this.medicines[medicineIndex].quantity++;
        } else {
            this.medicines.push({
                med: medicineIdParam,
                quantity: 1,
            });
        }
        await this.save();
    } catch (error) {
        throw new Error(error);
    }
};

cartSchema.methods.deleteFromCart = async function (medicineIdParam) {
    try 
    {
        const medicineDel = this.medicines.find(
            (singeMed) => singeMed.med.toString() === medicineIdParam.toString()
        );
        if (medicineDel && medicineDel.quantity.toString()!=="1") 
        {
            this.medicines = this.medicines.map((singeMed) => {
                if(singeMed.med.toString() === medicineIdParam.toString())
                {
                    singeMed.quantity-=1;
                }
                return singeMed;
            });
        } 
        else if(medicineDel && medicineDel.quantity.toString()==="1")
        {
            this.medicines = this.medicines.filter((singeMed) => singeMed.med.toString() !== medicineIdParam.toString());
        }
        else
        {
            return false;
        }
        await this.save();
        return true;
    } 
    catch (error) 
    {
        throw new Error(error);
    }
};

cartSchema.methods.removeFromCart = async function (medicineIdParam) {
    try 
    {
        let flag=false;
        const prevLength=this.medicines.length;
        this.medicines = this.medicines.filter((singeMed) => singeMed.med.toString() !== medicineIdParam.toString());
        flag=this.medicines.length==prevLength?false:true;
        await this.save();
        return flag;
    } 
    catch (error) 
    {
        throw new Error(error);
    }
};



const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;