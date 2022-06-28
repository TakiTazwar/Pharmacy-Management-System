import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm} from 'react-hook-form';
import axios from 'axios';

function PasswordReset() {
    const {resetToken,userId}= useParams();
    const navigate=useNavigate();
    const headers={"Content-Type":"application/json"};

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
      } = useForm( {
        mode: "onChange"
      });
    
      const  onSubmit = async (data) => {
        const password=data.password;
        const confirmPassword=data.confirm_password;
        data={
            password:password,
            confirmPassword:confirmPassword,
            resetToken:resetToken,
            userId:userId

        }
        console.log(data);
        axios.post("http://localhost:5000/user/resetpassword",data,headers).then(res=>
        {
            if(res.data.success==true){
            alert("Reset Password Mail Sent");
            navigate("/login");
            }
            else{
            alert(res.data.message);
            }
        }).catch(res=>navigate("/internalError"));
    }

  return (
    <div>
        <h1>Enter New Password </h1>
        <form className='form' onSubmit={handleSubmit(onSubmit)}>
            <input className='input' name="password" placeholder='Password' {...register('password',  { required: true,pattern:/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/})} />
            {errors.password && errors.password.type=="pattern" && <p className='errorShow'>Password should contain atleast one number and one special character Min length 6</p>}
            {errors.password && errors.password.type=="required" && <p className='errorShow'>Password cannot be empty</p>}
            <br></br>
            <br></br>
            <input className='input' name="confirm_password" placeholder='Confirm Password'
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
            <input className='submitFeedback' type="submit" />
        </form>

    </div>
  )
}

export default PasswordReset;