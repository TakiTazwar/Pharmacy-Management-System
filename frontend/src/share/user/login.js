import React,{useState} from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
function Login() {

  const [formData,setFormData]=useState({});
  const navigate=useNavigate();
  const headers={"Content-Type":"application/json"};


  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm( {
    mode: "onChange"
  });

  const  onSubmit = async (data) => {
      localStorage.setItem('email', data.email);
      axios.post("http://localhost:5000/user/login",data,headers).then(res=>
    {
      if(res.data.success==true){
      alert("Login success");
      localStorage.setItem('token', res.data.data.access_token);
      localStorage.setItem('type', res.data.data.type);
      localStorage.setItem('id', res.data.data._id);
      localStorage.setItem('verify', res.data.data.verify);
      localStorage.setItem('admin', res.data.data.admin);
      if(res.data.data.admin==true)
      {
        navigate("/pharmacist");
      }
      else if(res.data.data.type=="customer")
      {
        navigate("/customer");
      }
      else if(res.data.data.type=="delivery")
      {
        navigate("/delivery");
      }
      }
      else if(res.data.success==false){
        alert(res.data.message);
      }
    }).catch(res=>navigate("/internalError"));
      console.log(data);
  }

  return (
    <div style={{height:"605px",alignContent: 'center'}}>

      <form style={{backgroundColor:"#96b0bc",width:"500px",position:'relative',left:'500px',top:'150px',borderRadius: '25px'}} className='form' onSubmit={handleSubmit(onSubmit)}>
        <br></br>
        <input  className='input' name="email" placeholder='Email' {...register('email',  { required: true , pattern:/[\w-]+@([\w-]+\.)+[\w-]+/})} />
        {errors.email && errors.email.type=="pattern"&& <p className='errorShow'>Enter a valid Email</p>}
        {errors.email && errors.email.type=="required" && <p className='errorShow'>Email cannot be empty</p>}
        <br></br>
        <br></br>
        <input type="password"className='input' name="password" placeholder='Password' {...register('password',  { required: true,pattern:/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/})} />
        {errors.password && errors.password.type=="pattern" && <p className='errorShow'>Password should contain atleast one number and one special character Min length 6</p>}
        {errors.password && errors.password.type=="required" && <p className='errorShow'>Password cannot be empty</p>}
        <br></br>
        <br></br>
        <input className='submitFeedback' type="submit" />
        <br></br>
        <br></br>
        <Link to={"/resetpasswordmail"}> Reset Password </Link>
      </form>
    </div>
  )
}

export default Login;