import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Button, Nav,Navbar} from 'react-bootstrap';
import './header.css';
import 'bootstrap/dist/css/bootstrap.css';

function Header() {

  const navigate=useNavigate();

  async function logout()
  {
    localStorage.setItem('token', "");
    localStorage.setItem('type',"");
    localStorage.setItem('id', "");
    localStorage.setItem('verify', "");
    localStorage.setItem('email', "");
    localStorage.setItem('admin', "");
    navigate("/login");
  }

  return (
    <>
    <Navbar class="bg__myRed" variant='dark'>
      <Nav.Link><Link className='links' to={"/"}> Home</Link><span style={{paddingLeft:"30px"}}></span></Nav.Link>
      <Nav.Link><Link className='links' to={"/login"}>  Login  </Link><span style={{paddingLeft:"30px"}}></span></Nav.Link>
      <Nav.Link> <Link className='links' to={"/registration"}> Registration </Link><span style={{paddingLeft:"30px"}}></span></Nav.Link>
      {localStorage.getItem("token")!=""?<Nav.Link> <Button onClick={logout}>Logout</Button> </Nav.Link>:""}
    </Navbar>
    </>
  )
}

export default Header;