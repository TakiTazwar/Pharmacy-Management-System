import React ,{ useEffect,useState,useRef } from 'react';
import { useForm} from 'react-hook-form';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
import {Container, Row,Col, Form, Button,Input,Card} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';



function ShowOrder() {
    const headers={"Content-Type":"application/json","Authorization":"Bearer "+localStorage.getItem("token")};
    const firstUpdate = useRef(true);
    const [totalOrder,setTotalOrder]=useState(null);
    const navigate=useNavigate();
    let total=0;
    let count=1;

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
        } = useForm( {
        mode: "onChange"
        });
    
    useEffect(_=>{
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
          }
        axios({
            method: 'get',
            url: 'http://localhost:5000/customer/showorder',
            headers: headers
        }).then(res=>
          {
            console.log(res.data.data);
            if(res.data.success==true)
            {
                setTotalOrder(res.data.data);
            }
            else if(res.data.success==false)
            {
                alert(res.data.message);
                alert("Please Verify your account")
            }
        }).catch(res=> alert("Please Verify your account"));
        },[]);
    
    
    useEffect(_=>{
        console.log(totalOrder);
    },[totalOrder])


    
    async function cancelOrder(e)
    {
        const orderId=e.target.value;
        axios({
            method: 'delete',
            url: 'http://localhost:5000/customer/cancelorder/'+orderId,
            headers: headers
        })
        .then(res=>
        {
            axios({
                method: 'get',
                url: 'http://localhost:5000/customer/showorder',
                headers: headers
            }).then(res=>
              {
                if(res.data.success==true)
                {
                    setTotalOrder(res.data.data);
                }
                else if(res.data.success==false)
                {
                    alert(res.data.message);
                    navigate("/internalError");
                }
            }).catch(res=> alert("Please Verify your account"));
        }).catch(res=>alert("Please Verify your account"));
    }

    return (
        <Container>
            {totalOrder?
            <div>
                <Link className='links' to={"/customer"}> Go to Customer </Link><span style={{paddingLeft:"30px"}}></span>
                <br/>
                <br/>
                <h1>Ordered Medicines</h1>

                {totalOrder?totalOrder.map(order=>{
                return (<>
                    <Row >
                        <Card height="300px">
                                <Card.Body>
                                <Card.Title>Order {count++}</Card.Title>
                                <Card.Text><b>Status: </b>{order.status}</Card.Text>
                                <Card.Text><b>Address: </b>{order.address}</Card.Text>
                                <Card.Text><b>Payment Method: </b>{order.payementMethod}</Card.Text>
                                {order.status=="Accepted"?<><Card.Text><b>Delivery Man Name: </b>{order.deliveredBy.name}</Card.Text>
                                <Card.Text><b>Delivery Man Mobile: </b>{order.deliveredBy.phoneNumber}</Card.Text></>:""}
                                <Row>
                                {order.medicines?order.medicines.map(book=>{
                                    total=total+(parseInt(book.med.price)*parseInt(book.quantity));
                                    return (
                                        <Col >
                                            <Link to={"/book/"+book.med._id}>
                                                <Card.Title>{book.med.name}</Card.Title>
                                            </Link>
                                            <Card.Text><b>Price: </b>{book.med.price}</Card.Text>
                                            <Card.Text><b>Quantity: </b>{book.quantity}</Card.Text>                                                  
                                        </Col>
                                        )
                                    })
                                    :""}
                                </Row>
                                <br/><br/>
                                <Card.Text><b>Total Payment: </b>{total}</Card.Text>
                                {order.status=="Recieved"?<>
                                <b>Cancel Order: </b> <button onClick={cancelOrder} value={order._id}>Cancel</button>
                                </>:""}
                                </Card.Body>
                        </Card>
                    </Row>
                    <br/><br/>
                    </>
                    )
                })
                :""}
                <br></br>
            </div>
            :<h1>Not Found</h1>}
        </Container>
    )
    }

export default ShowOrder;