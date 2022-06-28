import React from 'react';
import {Link} from 'react-router-dom';

function PharmacyHome() {
  return (
    <div style={{height:"600px"}}>
            <Link className='links' to={"/pharmacist/addBook"}>  Add Medicine </Link><span style={{paddingLeft:"30px"}}></span>
            <Link className='links' to={"/pharmacist/showAllBook"}> Show All Medicine  </Link><span style={{paddingLeft:"30px"}}></span>
    </div>
  )
}

export default PharmacyHome;