import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function VerifyMail({children}) {
  
  const [verify,setVerify]=useState();
  const navigate=useNavigate();
  const firstUpdate = useRef(true);


  useEffect(_=>{
    if (firstUpdate.current) {
        firstUpdate.current = false;
        return;
      }
      const newVerify=localStorage.getItem("verify");
      setVerify(newVerify);
    },[]);

  const sendVerifyMail=()=>{
    const id=localStorage.getItem("id");
    axios.get("http://localhost:5000/user/refreshVerify/"+id).then(res=>
    {
    if(res.data.success==true){
    alert("Verify Password Mail Sent");
    navigate("/login");
    }
    else{
      alert(res.data.message);
    }

    }).catch(res=>navigate("/internalError"));
  }

  return (
    <div>
        {verify=="false"?<><button onClick={sendVerifyMail}>Verify Your Mail</button><br/><br/><br/><br/><br/></>:""}
        
        {children}
    </div>
  )
}

export default VerifyMail;