import React ,{ useEffect,useState,useRef } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
import {Container, Row,Col, Form, Button,Input,Card} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function CustomerCart() {
    const headers={"Content-Type":"application/json","Authorization":"Bearer "+localStorage.getItem("token")};
    const firstUpdate = useRef(true);
    //let itemNo=0;
    const [updatePage,setUpdatePage]=useState(false);
    const [totalBook,setTotalBook]=useState(null);
    const navigate=useNavigate();
    let total=0;
    useEffect(_=>{
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
          }
        const userId= localStorage.getItem('id');
        const data={userId:userId};
        axios({
            method: 'get',
            url: 'http://localhost:5000/customer/showcart',
            headers: headers
        }).then(res=>
          {
            if(res.data.success==true)
            {
                setTotalBook(res.data.data.medicines);
            }
            else if(res.data.success==false)
            {
                alert(res.data.message);
                alert("Please Verify your account");
            }
        }).catch(res=> alert("Please Verify your account"));
        },[]);

    useEffect(_=>{
        console.log(totalBook);
    },[totalBook])

    function deleteCart(e)
    {
        const medicineId=e.target.value;
        const data={medicineId:medicineId};
        axios({
            method: 'delete',
            url: 'http://localhost:5000/customer/deletecart/'+medicineId,
            headers: headers
        }).then(res=>
        {
            axios({
                method: 'get',
                url: 'http://localhost:5000/customer/showcart',
                headers: headers
            }).then(res=>
              {
                if(res.data.success==true)
                {
                    setTotalBook(res.data.data.medicines);
                }
                else if(res.data.success==false)
                {
                    alert(res.data.message);
                    navigate("/internalError");
                }
            }).catch(res=> navigate("/internalError"));
        }).catch(res=>navigate("/internalError"));
    }

    function removeCart(e)
    {
        const medicineId=e.target.value;
        const data={medicineId:medicineId};
        axios({
            method: 'delete',
            url: 'http://localhost:5000/customer/removecart/'+medicineId,
            headers: headers
        }).then(res=>
        {
            axios({
                method: 'get',
                url: 'http://localhost:5000/customer/showcart',
                headers: headers
            }).then(res=>
              {
                if(res.data.success==true)
                {
                    setTotalBook(res.data.data.medicines);
                }
                else if(res.data.success==false)
                {
                    alert(res.data.message);
                    navigate("/internalError");
                }
            }).catch(res=> alert("Please Verify your account"));
        }).catch(res=>alert("Please Verify your account"));
    }
    async function addCart(e)
    {
        const medicineId=e.target.value;
        const data={medicineId:medicineId};
        const cartAdded=await axios({
            method: 'post',
            url: 'http://localhost:5000/customer/addcart',
            data: data,
            headers: headers
        })

        if(cartAdded.data.success==true)
        {
            axios({
                method: 'get',
                url: 'http://localhost:5000/customer/showcart',
                headers: headers
            }).then(res=>
              {
                if(res.data.success==true)
                {
                    setTotalBook(res.data.data.medicines);
                }
                else if(res.data.success==false)
                {
                    alert(res.data.message);
                    navigate("/internalError");
                }
            }).catch(res=> navigate("/internalError"));
        }
        else
        {
            alert(cartAdded.data.message);
        }
    }

    return (
        <Container>
            {totalBook?
            <div>
                <Link className='links' to={"/customer"}> Go to Customer </Link><span style={{paddingLeft:"30px"}}></span>
                <br/>
                <br/>
                <h1>Cart Medicines</h1>

                <Row xs={2} md={4} lg={6}>
                {totalBook?totalBook.map(book=>{
                    total=total+(parseInt(book.med.price)*parseInt(book.quantity));
                return (
                    <Col >
                        <Card height="300px">
                                <Card.Body>
                                <Link to={"/book/"+book.med._id}>
                                    <Card.Title>{book.med.name}</Card.Title>
                                </Link>
                                <Card.Text><b>Price: </b>{book.med.price}</Card.Text>
                                <Card.Text><b>Quantity: </b>{book.quantity}</Card.Text>
                                <Button value={book.med._id} onClick={addCart}>+</Button>
                                <span style={{paddingLeft:"30px"}}></span>
                                <Button value={book.med._id} onClick={deleteCart}>-</Button>
                                <br/><br/>
                                <Button value={book.med._id} onClick={removeCart}>Remove from Cart</Button>
                                </Card.Body>
                        </Card>
                    </Col>
                    )
                })
                :""}
                <br></br>
                
                </Row>
                <h1>Total Price: {total}</h1>
                <Link to={"/createorder"}>
                <Button>Proceed To Order</Button>
                </Link>
            </div>
            :<h1>Not Found</h1>}
        </Container>
    )
    }

export default CustomerCart;