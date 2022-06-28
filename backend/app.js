
const dbConnect=require('./config/database');
const userRouter = require('./routes/user');
const pharmacistRouter = require('./routes/pharmacist');
const customerRouter = require('./routes/customer');
const deliveryRouter = require('./routes/delivery');
const HTTP_STATUS = require('./utils/httpStatus');
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors=require("cors");
const {success,failed}=require('./utils/message');

const app = express();
app.use(cors({origin:"http://localhost:3000",methods:["GET","POST","PUT","DELETE"]}));
app.use('/images',express.static(path.join(__dirname, 'images')));
dotenv.config();


app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.use('/user',userRouter);
app.use('/pharmacist',pharmacistRouter);
app.use('/customer',customerRouter);
app.use('/delivery',deliveryRouter);

app.get('/showDock',(req,res,next)=>
{
    res.send("Docker Working");
});

app.use('/',(req,res,next)=>{
    console.log(req.url);
    res.status(HTTP_STATUS.NOT_FOUND).send(failed('404 Not Found'));
})


app.use((err, req, res, next) => {
    console.log(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(
        failed('Internal Server Error!')
    );
})


// app.listen(5000, () => {
//     console.log('Application is running on 5000');
// });
dbConnect(()=>{
    app.listen(5000, () => {
        console.log('Application is running on 5000');
    });
});
