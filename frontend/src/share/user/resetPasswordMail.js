import axios from 'axios';
import { useForm } from 'react-hook-form';
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function ResetPasswordMail() {

  const firstUpdate = useRef(true);
  const headers={"Content-Type":"application/json"};
  const navigate=useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm( {
    mode: "onChange"
  });

  const  onSubmit = async (data) => {
    const email=data.email;
    axios.post("http://localhost:5000/user/resetpasswordmail",data,headers).then(res=>
  {
    if(res.data.success==true){
    alert("Reset Password Mail Sent");
    navigate("/login");
    }
    else{
      alert(res.data.message);
    }

  }).catch(res=>navigate("/internalError"));
    console.log(data);
}

  return (
    <div>
      <form style={{backgroundColor:"#96b0bc",width:"500px",position:'relative',left:'500px',top:'150px',borderRadius: '25px'}} className='form' onSubmit={handleSubmit(onSubmit)}>
        <h1>Reset Password</h1>
        <br></br>
        <input  className='input' name="email" placeholder='Email' {...register('email',  { required: true , pattern:/[\w-]+@([\w-]+\.)+[\w-]+/})} />
        {errors.email && errors.email.type=="pattern"&& <p className='errorShow'>Enter a valid Email</p>}
        {errors.email && errors.email.type=="required" && <p className='errorShow'>Email cannot be empty</p>}
        <br></br>
        <br></br>
        <input className='submitFeedback' type="submit" />
      </form>
    </div>
  )
}

export default ResetPasswordMail;