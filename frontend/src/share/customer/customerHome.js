import React from 'react';
import {Link} from 'react-router-dom';

function CustomerHome() {
  return (
    <div style={{height:"480px"}}>
            <Link className='links' to={"/customer/cart"}> Go to Cart </Link><span style={{paddingLeft:"30px"}}></span>
            <Link className='links' to={"/customer/showAllBook"}> Show All Medicine  </Link><span style={{paddingLeft:"30px"}}></span>
            <Link className='links' to={"/customer/showorder"}> Show Orders </Link><span style={{paddingLeft:"30px"}}></span>
    </div>
  )
}

export default CustomerHome;