import React from 'react';
import {Routes,Route} from 'react-router-dom';


import Footer from './footer';
import Header from './header';
import Home from '../share/home';
import Login from '../share/user/login';
import Registration from '../share/user/registration';
import AddProduct from '../share/pharmacist/addProduct';
import EditProduct from '../share/pharmacist/editProduct';
import ShowProduct from '../share/pharmacist/showProduct';
import PharmacyHome from '../share/pharmacist/pharmacyHome';
import DeleteProuct from '../share/pharmacist/deleteProduct';
import ShowSingleBook from '../share/customer/showSingleProduct';
import CustomerCart from '../share/customer/customerCart';
import CustomerHome from '../share/customer/customerHome';
import CustomerShowProduct from '../share/customer/customerShowMed';
import NotFound from '../share/404';
import InternalError from '../share/internalError';
import ResetPasswordMail from '../share/user/resetPasswordMail';
import PasswordReset from '../share/user/passwordReset';
import VerifyMail from '../share/user/verifyMail';
import CreateOrder from '../share/customer/createOrder';
import ShowOrder from '../share/customer/showOrder';
import DeliveryHome from '../share/deliveryMan/deliveryHome';
import ShowOrderDelivery from '../share/deliveryMan/showAllOrder';
import ShowAcceptedItem from '../share/deliveryMan/showAcceptedOrder';
import ProtectedRoute from '../services/protectedRoute';

function Main() {
  
  return (
    <div>
      
      <Header/>
      <br></br>
      <Routes>
        <Route path='/pharmacist/addBook' element={<ProtectedRoute><><br></br><br></br><br></br><AddProduct></AddProduct><br></br><br></br><br></br><br></br></></ProtectedRoute>}> </Route>
        <Route path='/pharmacist' element={<ProtectedRoute><PharmacyHome></PharmacyHome></ProtectedRoute>}> </Route>
        <Route path='/pharmacist/showAllBook' element={<ProtectedRoute><ShowProduct></ShowProduct></ProtectedRoute>}> </Route>
        <Route path='/pharmacist/delete/:id' element={<ProtectedRoute><DeleteProuct></DeleteProuct></ProtectedRoute>}> </Route>
        <Route path='/pharmacist/editBook/:id' element={<ProtectedRoute><EditProduct></EditProduct></ProtectedRoute>}> </Route>
        <Route path='/customer/showAllBook' element={<CustomerShowProduct></CustomerShowProduct>}> </Route>
        <Route path='/customer/cart' element={<CustomerCart></CustomerCart>}> </Route>
        <Route path='/customer' element={<VerifyMail><CustomerHome></CustomerHome></VerifyMail>}> </Route>
        <Route path='/book/:id' element={<ShowSingleBook></ShowSingleBook>}> </Route>
        <Route path='/internalError' element={<InternalError></InternalError>}> </Route>
        <Route path='/registration' element={<Registration></Registration>}> </Route>
        <Route path='/login' element={<Login></Login>}> </Route>
        <Route path='/resetpasswordmail' element={<ResetPasswordMail></ResetPasswordMail>}> </Route>
        <Route path='/user/passwordreset/:resetToken/:userId' element={<PasswordReset></PasswordReset>}> </Route>
        <Route path='/createorder' element={<CreateOrder></CreateOrder>}> </Route>
        <Route path='/customer/showorder' element={<ShowOrder></ShowOrder>}> </Route>
        <Route path='/delivery' element={<DeliveryHome></DeliveryHome>}> </Route>
        <Route path='/delivery/showorder' element={<ShowOrderDelivery></ShowOrderDelivery>}> </Route>
        <Route path='/delivery/showaccepted' element={<ShowAcceptedItem></ShowAcceptedItem>}> </Route>
        <Route path='/' element={<Home></Home>}> </Route>
        <Route path='*' element={<NotFound></NotFound>}> </Route>

      </Routes>
      
      <Footer/>
    </div>
  )
}

export default Main;