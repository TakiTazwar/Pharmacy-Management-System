import React ,{ useEffect,useState,useRef } from 'react';
import { useForm} from 'react-hook-form';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
import {Container, Row,Col, Form, Button,Input,Card} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';



function ShowAcceptedItem() {
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
            url: 'http://localhost:5000/delivery/showAcceptedItem',
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
                navigate("/internalError");
            }
        }).catch(res=> navigate("/internalError"));
        },[]);
    
    
    useEffect(_=>{
        console.log(totalOrder);
    },[totalOrder])


    
    async function DeliverOrder(e)
    {
        const orderId=e.target.value;
        const data={orderId:orderId}
        axios({
            method: 'post',
            url: 'http://localhost:5000/delivery/deliverorder',
            data:data,
            headers: headers
        })
        .then(res=>
        {
            axios({
                method: 'get',
                url: 'http://localhost:5000/delivery/showAcceptedItem',
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
            }).catch(res=> navigate("/internalError"));
        }).catch(res=>navigate("/internalError"));
    }

    

    return (
        <Container>
            {totalOrder?
            <div>
               
                <Link className='links' to={"/delivery"}> Go to Delivery Man </Link><span style={{paddingLeft:"30px"}}></span>
                <br/>
                <br/>
                <h1>Ordered Medicines</h1>
                <br/>
                <br/>
                {totalOrder.length==0?<h1>Not found</h1>:""}

                {totalOrder?totalOrder.map(order=>{
                return (<>
                    <Row >
                        <Card height="300px">
                                <Card.Body>
                                <Card.Title>Order {count++}</Card.Title>
                                <Card.Text><b>Name: </b>{order.customerId.name}</Card.Text>
                                <Card.Text><b>Mobile: </b>{order.customerId.phoneNumber}</Card.Text>
                                <Card.Text><b>Payment Method: </b>{order.payementMethod}</Card.Text>
                                <Card.Text><b>Address: </b>{order.address}</Card.Text>
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
                                <b>Order Delivered: </b> <button onClick={DeliverOrder} value={order._id}>Delivered</button>
                                </Card.Body>
                        </Card>
                    </Row>
                    <br/><br/>
                    </>
                    )
                })
                :<h1>Not Found</h1>}
                <br></br>
            </div>
            :<h1>Not Found</h1>}
        </Container>
    )
    }

export default ShowAcceptedItem;