import React ,{ useEffect,useState,useRef } from 'react';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';
import {Container, Row,Col, Form, Button,Input,Card} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function ShowSingleBook() {
    const firstUpdate = useRef(true);
    const {id}= useParams();
    const [book,setBook]=useState(null);
    const navigate=useNavigate();

    useEffect(_=>{
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
          }
        axios.get("http://localhost:5000/customer/viewmedicine/"+id).then(res=>
          {if(res.status==200){
            setBook(res.data);
          }
          else if(res.status==500){
            navigate("/internalError");
          }
        }).catch(res=>alert(res.statusText));
        },[]);
    useEffect(_=>{
        console.log(book);
    },[book]);

    return (
    <>
        {book?<div>
                {book.data?
                    <Container>
                        <Card>
                            <Card.Body>
                            <Card.Title><h1>{book.data.name}</h1></Card.Title>
                            <Row>
                               <Col>
                              </Col>
                              <Col>
                                <Card.Img height="450px" src={"http://localhost:5000/"+book.data.imageUrl} />
                              </Col>
                              <Col>
                              </Col>
                            </Row>
                            <Card.Text><b>Price: </b>{book.data.price}</Card.Text>
                            <Card.Text><b>Company: </b>{book.data.company}</Card.Text>
                            <Card.Text><b>Category: </b>{book.data.category}</Card.Text>
                            <Card.Text><b>License: </b>{book.data.license}</Card.Text>
                            <Card.Text><b>Country: </b>{book.data.country}</Card.Text>
                            </Card.Body>
                        </Card>
                        <br></br>
                    </Container>
                
                
                :<h1>Book Not Found</h1>}
            </div>
            :<h1>Book Not Found</h1>}
    </>
    )
    
}

export default ShowSingleBook;