import React, { useContext } from 'react'
import "./ShopCategory.css"
import { shopContext } from '../Context/context'
import Item from '../Components/Item/Item'
import dropdown_icon from "../Components/Assets/dropdown_icon.png"

const ShopCategory = (props) => {
  const {all_product}=useContext(shopContext)
  // console.log(all_product)
  const allFiltered_products=all_product.filter(x=>x.category==props.category)
  // const allFiltered_products=useContext(shopContext).filter(x=>x.category==props.category)
  return (
    <div className='ShopCategory'>
      <img src={props.banner} alt="" className='bannerImage'/>
      <div className="shop-category-indexSort">
        <p>
          <span>Showing 1-12</span> out of 36 products
        </p>
        <div className="shopcategory-sort">
          Sort by <img src={dropdown_icon} alt="" />
        </div>
      </div>
      <div className='shopcategory-products'>
    {
      allFiltered_products.map((item,index)=>{
        return <Item key={index} id={item.id} image={item.image} name={item.name} new_price={item.new_price} old_price={item.old_price}/>
      })
    }
      </div>
      <div className="shopcategory-loadmore">
        Explore More
      </div>
    </div>
  )
}

export default ShopCategory
