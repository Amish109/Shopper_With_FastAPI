import React from 'react'
import "./RelatedProducts.css"
import data_product from "../Assets/data"
import Item from '../Item/Item'
const RelatedProducts = () => {
  return (
    <div className='relatedProducts'>
      <h1>RelatedProducts</h1>
      <hr/>
      <div className="relatedProducts-item">
        {
            data_product.map((item,index)=>{
                return <Item key={index} id={item.id} image={item.image} name={item.name} new_price={item.new_price} old_price={item.old_price}/>
            })
        }
      </div>
    </div>
  )
}

export default RelatedProducts
