import React ,{ useEffect,useState,useRef } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { useForm} from 'react-hook-form';
import {Container, Row,Col, Form, Button,Input,Card} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function CustomerShowProduct() {
    const headers={"Content-Type":"application/json","Authorization":"Bearer "+localStorage.getItem("token")};
    const firstUpdate = useRef(true);
    //let itemNo=0;
    const mainUrl="http://localhost:5000/customer/viewallmedicine?";
    const [totalMedicine,setTotalMedicine]=useState(null);
    const [url,setUrl]=useState(mainUrl);
    const navigate=useNavigate();
    const itemNum=3;

    useEffect(_=>{
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
          }
        axios.get("http://localhost:5000/customer/viewallmedicine?page=1&items="+itemNum).then(res=>
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
        if(totalMedicine){
        console.log(totalMedicine.data.medicines)}
        console.log("done");
    },[totalMedicine])

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
      } = useForm( {
        mode: "onChange"
      });

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
            alert("Item Added to Cart");
        }
        else
        {
            alert(cartAdded.data.message);
        }
    }

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

    async function search(data)
    {
        const newUrl=mainUrl+"name="+data.name+"&category="+data.category+"&country="+data.country+"&pricelow="+data.pricelow+"&pricehigh="+data.pricehigh;
        await setUrl(newUrl);
        axios.get(newUrl).then(res=>
            {
              if(res.data.success==true)
              {
                  setTotalMedicine(res.data);
              }
              else if(res.data.success==false)
              {
                  alert(res.data.message);
                  alert("Please Verify your account");
              }
          }).catch(res=> navigate("/internalError"));

    }

    
    return (<>
        
            {totalMedicine?
            <>
            <Container>
            <div>

                <Link className='links' to={"/customer"}> Go to Customer </Link><span style={{paddingLeft:"30px"}}></span>
                <h1>All Medicines</h1>
                <br/>
                <Row>
                    <Form onSubmit={handleSubmit(search)}>
                        <Col>
                            <Form.Group controlId="formName">
                                <Form.Label>Search Name</Form.Label>
                                <Form.Control  type="text" {...register('name' )}></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formPrice">
                                <Form.Label>Search Lowest Price</Form.Label>
                                <Form.Control type="number" {...register('pricelow',{pattern:/^[0-9]+$/i} )}></Form.Control>
                                {errors.pricelow && errors.pricelow.type=="pattern" && <Form.Text className="text-muted"> Medicine Price Should be numbers only</Form.Text>}
                            </Form.Group>
                        
                        </Col>
                        <Col>
                            <Form.Group controlId="formPrice">
                                <Form.Label>Search Highest Price</Form.Label>
                                <Form.Control  type="number" {...register('pricehigh',{pattern:/^[0-9]+$/i} )}></Form.Control>
                                {errors.pricehigh && errors.pricehigh.type=="pattern" && <Form.Text className="text-muted"> Medicine Price Should be numbers only</Form.Text>}
                            </Form.Group>
                            </Col>
                            <Col>
                            <Form.Group controlId="formCategory">
                                <Form.Label>Search category</Form.Label>
                                <Form.Control type="text" {...register('category' )}></Form.Control>
                            </Form.Group>
                            </Col>
                            <Col>
                            <Form.Group controlId="formCountry">
                                <Form.Label>Search country</Form.Label>
                                <Form.Control type="text" {...register('country' )} ></Form.Control>
                            </Form.Group>
                            </Col>
                        <br></br>
                        <Button type="submit">Search</Button>
                    </Form>
                </Row>
                {totalMedicine.data.medicines.length==0?<h1>Not Found</h1>:""}
                <br/><br/>
                <Row xs={2} md={4} lg={6}>
                
                {totalMedicine.data?totalMedicine.data.medicines.map(meds=>{
                return (
                    
                    <Col >
                        
                        <Card height="300px">
                                <Card.Body>
                                <Link to={"/book/"+meds._id}>
                                    <Card.Title>{meds.name}</Card.Title>
                                    <Card.Img height="200px" src={"http://localhost:5000/"+meds.imageUrl} />
                                </Link>
                                <Card.Text><b>Price: </b>{meds.price}</Card.Text>
                                {localStorage.getItem("verify")=="true"?<Button value={meds._id} onClick={addCart}>Add to Cart</Button>:""}
                                </Card.Body>
                        </Card>
                    </Col>
                    )
                })
                :""}
                </Row>
                <br/><br/><br/>
                <Row>
                <Col>
                <span style={{paddingLeft:"30px"}}></span>
                </Col>
                <Col>
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
                </Col>
                </Row>
            </div>
            </Container>
           
            </>
            :<h1>Not Found</h1>}

        </>
        
    )
    }

export default CustomerShowProduct;