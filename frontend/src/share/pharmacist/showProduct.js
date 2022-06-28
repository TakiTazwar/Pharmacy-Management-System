import React ,{ useEffect,useState,useRef } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
import {Container, Row,Col, Form, Button,Input,Card} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactPaginate from 'react-paginate';

function ShowProduct() {

    const firstUpdate = useRef(true);
    const itemNum=3;
    const mainUrl="http://localhost:5000/customer/viewallmedicine?";
    const [url,setUrl]=useState(mainUrl);
    const [totalMedicine,setTotalMedicine]=useState(null);
    const navigate=useNavigate();

    useEffect(_=>{
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
          }
        axios.get("http://localhost:5000/customer/viewallmedicine").then(res=>
          {
            if(res.data.success==true)
            {
                setTotalMedicine(res.data);
            }
            else if(res.data.success==false)
            {
                alert(res.data.message);
                navigate("/internalError");
            }
        }).catch(res=> navigate("/internalError"));
        },[]);

    useEffect(_=>{
        console.log(totalMedicine);
    },[totalMedicine])

    async function handlePageClick(data)
    {
        const page=parseInt(data.selected)+1
        const Newurl=url+"&page="+page+"&items="+itemNum;
        //alert(Newurl);
        axios.get(Newurl).then(res=>
        {
          if(res.data.success==true)
          {
              setTotalMedicine(res.data);
          }
          else if(res.data.success==false)
          {
              alert(res.data.message);
              navigate("/internalError");
          }
      }).catch(res=> navigate("/internalError"));
    } 



    return (
        <Container>
            {totalMedicine?
            <div>
                <Link className='links' to={"/pharmacist"}> Go to Pharmacist </Link><span style={{paddingLeft:"30px"}}></span>
                <h1>All Medicines</h1>
                <Row xs={2} md={4} lg={6}>
                {totalMedicine.data?totalMedicine.data.medicines.map(book=>{
                return (
                    <Col >
                        <Card height="300px">
                                <Card.Body>
                                <Link to={"/book/"+book._id}>
                                    <Card.Title>{book.name}</Card.Title>
                                    <Card.Img height="200px" src={"http://localhost:5000/"+book.imageUrl} />
                                </Link>
                                <Card.Text><b>Price: </b>{book.price}</Card.Text>
                                <Row>
                                    <Col>
                                        <Link to={"/pharmacist/editBook/"+book._id}> <Button>Edit</Button> </Link>
                                    </Col>
                                    <Col>
                                        <Link to={"/pharmacist/delete/"+book._id}> <Button>Delete</Button> </Link>
                                    </Col>
                                </Row>
                                </Card.Body>
                        </Card>
                    </Col>
                    )
                })
                :""}
                </Row>
                <br/><br/><br/>
                <ReactPaginate 
                previousLabel={"<<"}
                nextLabel={">>"}
                breakLabel={"..."}
                pageCount={totalMedicine.data.totalItems/itemNum}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                />
            </div>
            :<h1>Not Found</h1>}
        </Container>
    )
    }

export default ShowProduct;