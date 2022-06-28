import React ,{ useEffect,useState,useRef } from 'react';
import { useForm} from 'react-hook-form';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
import {Container, Row,Col, Form, Button,Input,Card} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';



function CreateOrder() {
    const headers={"Content-Type":"application/json","Authorization":"Bearer "+localStorage.getItem("token")};
    const firstUpdate = useRef(true);
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
                navigate("/internalError");
            }
        }).catch(res=> navigate("/internalError"));
        },[]);
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
        } = useForm( {
        mode: "onChange"
        });
    useEffect(_=>{
        console.log(totalBook);
    },[totalBook])


    
    async function createOrder(data)
    {

        const orderAdded=await axios({
            method: 'post',
            url: 'http://localhost:5000/customer/addorder',
            data: data,
            headers: headers
        })

        if(orderAdded.data.success==true)
        {
            alert("Order Added Successfully");
        }
        else
        {
            alert(orderAdded.data.message);
        }
    }

    return (
        <Container>
            {totalBook?
            <div>
                <Link className='links' to={"/customer"}> Go to Customer </Link><span style={{paddingLeft:"30px"}}></span>
                <br/>
                <br/>
                <h1>Ordered Medicines</h1>

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
                                </Card.Body>
                        </Card>
                    </Col>
                    )
                })
                :""}
                <br></br>
                
                </Row>
                <h1>Total Price: {total}</h1>
                <Form onSubmit={handleSubmit(createOrder)}>
                    <Row>
                        <Form.Group controlId="formMethod">
                            <Form.Label>Payment Method</Form.Label>
                            <Form.Control type="text" {...register('paymentmethod',{required: true} )}></Form.Control>
                            {errors.paymentmethod && errors.paymentmethod.type=="required" && <Form.Text className="text-muted"> Payment Method is required</Form.Text>}
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group controlId="formAddress">
                            <Form.Label>Order Address</Form.Label>
                            <Form.Control type="text" {...register('address',{required: true} )}></Form.Control>
                            {errors.address && errors.address.type=="required" && <Form.Text className="text-muted"> Address is Required</Form.Text>}
                        </Form.Group>
                    </Row>
                    <br></br>
                    <Button type="submit">Confirm Order</Button>
                </Form>
            </div>
            :<h1>Not Found</h1>}
        </Container>
    )
    }

export default CreateOrder;