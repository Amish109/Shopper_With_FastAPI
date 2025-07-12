import React, { useState } from 'react'
import "./AddProduct.css"
// import upload_area from "../../assets/upload_area.svg"
import upload_area from "../Assets/upload_area.svg"
// import { API_URL } from '../../../../frontend/src/constants'
import { API_URL } from '../../constants'
import Sidebar from '../Sidebar/Sidebar'

const AddProduct = () => {
  const [image,setImage]=useState(false);
  const [productDetails,setProductDetails] = useState({
    name:"",
    image:"",
    category:"",
    new_price:"",
    old_price:""
  });
  const imageHandler=(event)=>{
    setImage(event.target.files[0])
  }
  const changeHandler=(e)=>{
    setProductDetails({...productDetails,[e.target.name]:e.target.value})
  }
  const Add_Product=async (event)=>{
    event.preventDefault();
    let responseText="";
    try {
      
    let form= event.target;
    let formdata= new FormData(form);
      let response = await fetch(API_URL+"/api/product/addproduct",{
        method:"POST",
        body:formdata,
      });
      let data=await response.json();
      responseText=data.responseText;
      alert(data.responseText);
    } catch (error) {
      alert(responseText);
    }
  }
  return (
    <div className='admin'>
    <Sidebar/>   
      <div className='add-product'>
        <form id="product_form" onSubmit={Add_Product}>
        <div className="addproduct-itemfields">
          <p>Product title</p>
          <input value={productDetails.name} onChange={(event)=>{changeHandler(event)}} type="text" placeholder='Type here' name='name' />
        </div>

        <div className="addproduct-price">
          <div className="addproduct-itemfields">
            <p>Product Price</p>
            <input value={productDetails.old_price} onChange={changeHandler} type="text" placeholder='Type here' name='old_price' />
          </div>
          <div className="addproduct-itemfields">
            <p>Offer Price</p>
            <input value={productDetails.new_price} onChange={changeHandler} type="text" placeholder='Type here' name='new_price' />
          </div>
        </div>

        <div className="addproduct-itemfield">
          <p>Product Category</p>
          <select name="category" id="" value={productDetails.category} onChange={changeHandler} className='add-product-selector'>
              <option value="women">women</option>
              <option value="men">men</option>
              <option value="kid">kid</option>
          </select>
        </div>

        <div className="addproduct-itemfield">
          <label htmlFor="file-input" className='addproduct-thumbnail-img'>
            <img src={image?URL.createObjectURL(image):upload_area} alt="" 
            />
          </label>
          <input onChange={(event)=>{
            imageHandler(event)
          }} type="file" name='product' id='file-input' hidden />
        </div>
        {/* <button onClick={()=>{Add_Product()}} className='addproduct-btn'>Add</button> */}
        <button type="submit" className='addproduct-btn'>Add</button>
        </form>
      </div>
    </div>
  )
}

export default AddProduct
