import React ,{ useEffect,useState,useRef } from 'react';
import { useForm} from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import {Container, Row, Form, Button,Input} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';

function EditProduct() {
    const headers={"Content-Type":"multipart/form-data","Authorization":"Bearer "+localStorage.getItem("token")};
    const firstUpdate = useRef(true);
    const {id}= useParams();
    const [editedBook,setEditedBook]=useState(null);
    const navigate=useNavigate();

    useEffect(_=>{
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
          }
        axios.get("http://localhost:5000/customer/viewmedicine/"+id).then(res=>
          {if(res.status==200){
              setEditedBook(res.data);
          }
        }).catch(res=>alert(res.statusText));
        },[]);

    useEffect(_=>{
        console.log(editedBook);
    },[editedBook])
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
      } = useForm( {
        mode: "onChange"
      });

      const  onSubmit = async (data) => {

            
            let formData= new FormData();
            let file=data.imageUrl[0];
            if(file)
            {
                
                formData.append('productImage',file);
            }

            formData.append('category',data.category);
            formData.append('company',data.company);
            formData.append('country',data.country);
            formData.append('license',data.license);
            formData.append('name',data.name);
            formData.append('price',data.price);
            console.log(file);
        //   axios.put("http://localhost:5000/pharmacist/editmedicine/"+id,formData,headers).then(res=>
        //   {
        //     if(res.data.success==true){
        //         alert("Medicine edited success");
        //         navigate("/pharmacist/showAllBook");
        //     }
        //     else if(res.data.success==false){
        //         alert(res.data.message);
        //     }
              
        //   }).catch(res=>alert(res.statusText));
        const updated=await axios({
            method: 'put',
            url: 'http://localhost:5000/pharmacist/editmedicine/'+id,
            data: formData,
            headers: headers
        })
        if(updated.data.success==true)
        {
            alert(updated.data.message);
            navigate("/pharmacist/showAllBook");
        }
        else
        {
            alert(updated.data.message);
        }
        console.log(data);
      }

    return (
    <>
    {editedBook?
    <div>
        {editedBook.data?
            <Container>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Medicine Name</Form.Label>
                            <Form.Control  type="text" onChange={e=>console.log(e.target.value)} defaultValue={editedBook.data?editedBook.data.name:""} {...register('name',{required: true,pattern:/^[a-zA-Z0-9 ]+$/i} )}></Form.Control>
                            {errors.name && errors.name.type=="pattern" && <Form.Text className="text-muted"> Medicine name Should be alphabets or numbers only</Form.Text>}
                            {errors.name && errors.name.type=="required" && <Form.Text className="text-muted"> Medicine name can't be empty</Form.Text>}
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group controlId="formPrice">
                            <Form.Label>Medicine Price</Form.Label>
                            <Form.Control type="number" defaultValue={editedBook.data?editedBook.data.price:""} {...register('price',{required: true,pattern:/^[0-9]+$/i} )}></Form.Control>
                            {errors.price && errors.price.type=="pattern" && <Form.Text className="text-muted"> Medicine Price Should be numbers only</Form.Text>}
                            {errors.price && errors.price.type=="required" && <Form.Text className="text-muted"> Medicine Price can't be empty</Form.Text>}
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group controlId="formImageUrl">
                            <Form.Label>Medicine Image URL</Form.Label>
                            <Form.Control type="file" {...register('imageUrl')}></Form.Control>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group controlId="formCategory">
                            <Form.Label>Medicine category</Form.Label>
                            <Form.Control type="text" defaultValue={editedBook.data?editedBook.data.category:""} {...register('category',{required: true} )} ></Form.Control>
                            {errors.category && errors.category.type=="required" && <Form.Text className="text-muted"> Medicine category must be Added</Form.Text>}
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group controlId="formCompany">
                            <Form.Label>Medicine company</Form.Label>
                            <Form.Control type="text" defaultValue={editedBook.data?editedBook.data.company:""} {...register('company',{required: true} )} ></Form.Control>
                            {errors.company && errors.company.type=="required" && <Form.Text className="text-muted"> Medicine company must be Added</Form.Text>}
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group controlId="formLicense">
                            <Form.Label>Medicine license</Form.Label>
                            <Form.Control type="text" defaultValue={editedBook.data?editedBook.data.license:""} {...register('license',{required: true} )} ></Form.Control>
                            {errors.license && errors.license.type=="required" && <Form.Text className="text-muted"> Medicine license must be Added</Form.Text>}
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group controlId="formDescription">
                            <Form.Label>Medicine country</Form.Label>
                            <Form.Control type="text" defaultValue={editedBook.data?editedBook.data.country:""} {...register('country',{required: true} )} ></Form.Control>
                            {errors.country && errors.country.type=="required" && <Form.Text className="text-muted"> Medicine country must be Added</Form.Text>}
                        </Form.Group>
                    </Row>
                    <br></br>
                    <Button type="submit">Submit</Button>
                </Form>
            </Container>
             : <h1>{editedBook.message}</h1>  }
    </div>
    :<h1>Cannot Connect to Server</h1>}

    </>
    )
}

export default EditProduct;