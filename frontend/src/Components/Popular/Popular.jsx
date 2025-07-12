import React, { useEffect, useState } from 'react'
import "./Popular.css"
// import data_product from "../Assets/data"
import Item from '../Item/Item'
import { API_URL } from '../../constants'

const Popular = () => {
  const [popularProduct,setPopularProduct] =useState([]);
  useEffect(()=>{
    fetch(API_URL+"/api/product/popularInWomen").then((response)=>response.json()).then((data)=>setPopularProduct(data.data))
  },[])
  return (
    <div className='popular'>
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {popularProduct.length>0&&popularProduct.map((item,index)=>{
            return <Item key={index} id={item.id} image={item.image} name={item.name} new_price={item.new_price} old_price={item.old_price}/>
        })}

      </div>
    </div>
  )
}

export default Popular
