import React, { useEffect,useState,useRef } from 'react';
import { useForm} from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import 'views/style/registration.css';

function Registration() {
  
  const [formData,setFormData]=useState({});
  const firstUpdate = useRef(true);
  const headers={"Content-Type":"application/json"};
  
  const navigate=useNavigate();

  useEffect(_=>{
    if (firstUpdate.current) {
        firstUpdate.current = false;
        return;
      }
    console.log(formData);},[formData]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm( {
    mode: "onChange"
  });


  const  onSubmit =  async (data) => {
    data.type="customer";
    console.log(data);
    await axios.post("http://localhost:5000/user/registration",data,headers).then(res=>
    {
      if(res.data.success==true)
      {
        localStorage.setItem('type', res.data.data.type);
        localStorage.setItem('id', res.data.data.id);
        localStorage.setItem('token', res.data.data.access_token);
        alert("registration success");
        navigate("/login");
      }
      else if(res.data.success==false)
      {
        alert(res.data.message);
      }
    }).catch(res=>navigate("/internalError"));
}
  

  return (
    <form style={{height:"600px"}} className='form' onSubmit={handleSubmit(onSubmit)}>
      <br></br>
      <br></br>
      <h1 className='formHeader'>Registration Form</h1>
      <input className='input' name="email" placeholder='Email' {...register('email',  { required: true , pattern:/[\w-]+@([\w-]+\.)+[\w-]+/})} />
      {errors.email && errors.email.type=="pattern"&& <p className='errorShow'>Enter a valid Email</p>}
      {errors.email && errors.email.type=="required" && <p className='errorShow'>Email cannot be empty</p>}
      <br></br>
      <br></br>
      <input className='input' name="name" placeholder='Name' {...register('name',  { required: true , pattern:/[a-zA-Z]+/})} />
      {errors.name && errors.name.type=="pattern"&& <p className='errorShow'>Enter a valid Name</p>}
      {errors.name && errors.name.type=="required" && <p className='errorShow'>Name cannot be empty</p>}
      <br></br>
      <br></br>
      <input className='input' type="password" name="password" placeholder='Password' {...register('password',  { required: true,pattern:/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/})} />
      {errors.password && errors.password.type=="pattern" && <p className='errorShow'>Password should contain atleast one number and one special character Min length 6</p>}
      {errors.password && errors.password.type=="required" && <p className='errorShow'>Password cannot be empty</p>}
      <br></br>
      <br></br>
      <input className='input' type="password" name="confirm_password" placeholder='Confirm Password'
        {...register("confirm_password", {
          required: true,
          validate: (val) => {
            if (watch('password') != val) {
              return false;
            }
          },
        })}
      />
      {errors.confirm_password && errors.confirm_password.type=="validate"&& <p className='errorShow'>Your passwords do no match</p>}
      {errors.confirm_password && errors.confirm_password.type=="required" && <p className='errorShow'>Confirm Password Cannot be Empty</p>}
      <br></br>
      <br></br>
      <input className='input' name="phoneNumber" placeholder='phoneNumber' {...register('phoneNumber',  { required: true , pattern:/[0-9]+/})} />
      {errors.phoneNumber && errors.phoneNumber.type=="pattern"&& <p className='errorShow'>Enter a valid phoneNumber</p>}
      {errors.phoneNumber && errors.phoneNumber.type=="required" && <p className='errorShow'>Name cannot be phoneNumber</p>}
      <br></br>
      <br></br>
      <input className='submitFeedback' type="submit" />
    </form>
  );
}

export default Registration;