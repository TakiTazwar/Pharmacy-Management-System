import React from 'react';
import {Link} from 'react-router-dom';

function DeliveryHome() {
  return (
    <div style={{height:"600px"}}>
            <Link className='links' to={"/delivery/showaccepted"}> Show Accepted Order  </Link><span style={{paddingLeft:"30px"}}></span>
            <Link className='links' to={"/delivery/showorder"}> Show Customer Order </Link><span style={{paddingLeft:"30px"}}></span>
    </div>
  )
}

export default DeliveryHome;