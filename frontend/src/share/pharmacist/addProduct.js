import React ,{ useEffect,useState,useRef } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import { useForm} from 'react-hook-form';
import axios from 'axios';

import {Container, Row, Form, Button,Input} from 'react-bootstrap';
import './addProduct.css'
import 'bootstrap/dist/css/bootstrap.min.css';

function AddProduct() {
    const headers={"Content-Type":"multipart/form-data","Authorization":"Bearer "+localStorage.getItem("token")};
    const navigate=useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
      } = useForm( {
        mode: "onChange"
      });

      const  onSubmit = async (data) => {
        let file=data.imageUrl[0];
        let formData= new FormData();
        formData.append('category',data.category);
        formData.append('company',data.company);
        formData.append('country',data.country);
        formData.append('license',data.license);
        formData.append('name',data.name);
        formData.append('price',data.price);
        formData.append('productImage',file);
        const added=await axios({
            method: 'post',
            url: 'http://localhost:5000/pharmacist/addmedicine',
            data: formData,
            headers: headers
        });        
        if(added.data.success==true)
        {
            alert("Medicine added success");
            navigate("/pharmacist/showAllBook");
        }
        else
        {
            alert(added.data.message);
        }
        console.log(data);
        console.log("after axiost",added);
      }

    return (
    <div className="main__add__product">
        <Link className='links' to={"/pharmacist"}> Go to Pharmacist </Link><span style={{paddingLeft:"30px"}}></span>
        <br></br>
        <br></br>
        <Container>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Form.Group controlId="formName">
                        <Form.Label>Medicine Name</Form.Label>
                        <Form.Control type="text" {...register('name',{required: true,pattern:/^[a-zA-Z0-9 ]+$/i} )}></Form.Control>
                        {errors.name && errors.name.type=="pattern" && <Form.Text className="text-muted">Medicine Name Should be alphabets or numbers only</Form.Text>}
                        {errors.name && errors.name.type=="required" && <Form.Text className="text-muted">Medicine Name can't be empty</Form.Text>}
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group controlId="formPrice">
                        <Form.Label>Medicine Price</Form.Label>
                        <Form.Control type="number" {...register('price',{required: true,pattern:/^[0-9]+$/i} )}></Form.Control>
                        {errors.price && errors.price.type=="pattern" && <Form.Text className="text-muted"> Medicine Price Should be numbers only</Form.Text>}
                        {errors.price && errors.price.type=="required" && <Form.Text className="text-muted"> Medicine Price can't be empty</Form.Text>}
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group controlId="formCategory">
                        <Form.Label>Medicine category</Form.Label>
                        <Form.Control type="text" {...register('category',{required: true} )}></Form.Control>
                        {errors.category && errors.category.type=="required" && <Form.Text className="text-muted"> Medicine category must be Added</Form.Text>}
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group controlId="formCompany">
                        <Form.Label>Medicine company</Form.Label>
                        <Form.Control type="text" {...register('company',{required: true} )} ></Form.Control>
                        {errors.company && errors.company.type=="required" && <Form.Text className="text-muted"> Medicine company must be Added</Form.Text>}
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group controlId="formLicense">
                        <Form.Label>Medicine license</Form.Label>
                        <Form.Control type="text" {...register('license',{required: true} )} ></Form.Control>
                        {errors.license && errors.license.type=="required" && <Form.Text className="text-muted"> Medicine license must be Added</Form.Text>}
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group controlId="formCountry">
                        <Form.Label>Medicine country</Form.Label>
                        <Form.Control type="text" {...register('country',{required: true} )} ></Form.Control>
                        {errors.country && errors.country.type=="required" && <Form.Text className="text-muted"> Medicine country must be Added</Form.Text>}
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group controlId="formImageUrl">
                        <Form.Label>Medicine imageUrl</Form.Label>
                        <Form.Control type="file" {...register('imageUrl',{required: true} )} ></Form.Control>
                        {errors.imageUrl && errors.imageUrl.type=="required" && <Form.Text className="text-muted"> Medicine image must be Added</Form.Text>}
                    </Form.Group>
                </Row>
                <br></br>
                <Button type="submit">Submit</Button>
            </Form>
        </Container>
    </div>
    )
}

export default AddProduct;