import React ,{ useEffect,useState,useRef } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';

function DeleteProuct() {
    const headers={"Authorization":"Bearer "+localStorage.getItem("token")};
    const {id}= useParams();
    const firstUpdate = useRef(true);
    const navigate=useNavigate();

    useEffect(_=>{
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
          }
          console.log('http://localhost:5000/pharmacist/deleteBook/'+id)
        axios({
          method: 'delete',
          url: 'http://localhost:5000/pharmacist/deleteBook/'+id,
          headers: headers
        }).then(res=>
            {if(res.status==200){
              navigate("/pharmacist/showAllBook");
            }
            else if(res.status==500){
              navigate("/internalError");
            }
          }).catch(res=>alert(res.statusText));
        },[]);

    return (
    <div><h1>Deleting Product</h1></div>
    )
}

export default DeleteProuct;