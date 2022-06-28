const medData = require('../model/medicine');
const {success,failed}=require('../utils/message');
const HTTP_STATUS =require('../utils/httpStatus');
const { validationResult } = require('express-validator');
const fs = require('fs/promises');
const path = require('path');

class PharmacistController
{
    
    async addMedicine(req,res,next)
    {
        try
        {
            const fileType=true;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                req.file?await fs.unlink(path.join(__dirname, '..', req.file.path)):"";
                return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failed(errors.array()));
            }

            req.file?"":res.send(failed("Invalid File type"));
            const name = req.body.name;
            const price = req.body.price;
            const category = req.body.category;
            const company = req.body.company;
            const license = req.body.license;
            const country = req.body.country;
            const imageUrl = 'images/'+req.file.filename;
            const newMed = new medData({name, price, category, company,license,country,imageUrl});

            await newMed.save();

            res.status(HTTP_STATUS.OK).send(success('The medicine has been added successfully'));
        }
        catch(error)
        {
            next(error);
        }
    }

    async editMedicine(req, res, next) 
    {
        try
        {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                req.file?await fs.unlink(path.join(__dirname, '..', req.file.path)):"";
                return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failed(errors.array()));
            }
            const medId = req.params.medId;
            const updatedMedicine = await medData.findById(medId).exec();

            if(updatedMedicine)
            {
                let message="The medicine Edited Successfully";
                updatedMedicine.name = req.body.name? req.body.name: updatedMedicine.name;
                updatedMedicine.price = req.body.price? req.body.price: updatedMedicine.price;
                updatedMedicine.category = req.body.category? req.body.category: updatedMedicine.category;
                updatedMedicine.company = req.body.company? req.body.company: updatedMedicine.company;
                updatedMedicine.license = req.body.license? req.body.license: updatedMedicine.license;
                updatedMedicine.country = req.body.country? req.body.country: updatedMedicine.country;

                if (req.file) {
                    await fs.unlink(path.join(__dirname, '..', updatedMedicine.imageUrl));
                    updatedMedicine.imageUrl = 'images/' + req.file.filename;
                }
                else
                {
                    message=message+" . File  was not Updated";
                }
    
                await updatedMedicine.save();
                res.status(HTTP_STATUS.OK).send(success(message,updatedMedicine));
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

    async deleteMedicine(req, res, next) 
    {
        try
        {
            const medId = req.params.medId;
            const deletedMedicine = await medData.findById(medId).exec();
            await fs.unlink(path.join(__dirname, '..', deletedMedicine.imageUrl));
            
            const del = await medData.findOneAndDelete({_id:medId}).exec();
            if(del)
            {
                res.status(HTTP_STATUS.OK).send(success("Product Deleted Successfully",del));
            }
            else
            {
                res.status(HTTP_STATUS.NOT_FOUND).send(failed("Product wasn't found"));
            }
        }
        catch(error)
        {
            next(error);
        }
    }

    

}

module.exports = new PharmacistController();