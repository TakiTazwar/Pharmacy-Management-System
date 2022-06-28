import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({children}) {
  
  const [verify,setVerify]=useState();
  const navigate=useNavigate();
  const firstUpdate = useRef(true);


  useEffect(_=>{
    if (firstUpdate.current) {
        firstUpdate.current = false;
        return;
      }
      const newVerify=localStorage.getItem("admin");
      setVerify(newVerify);
    },[]);


  return (
    <div style={{height:"600px"}}>
        {verify=="false"?<><h1>You are not authorized</h1><br/></>:children}
    </div>
  )
}

export default ProtectedRoute;