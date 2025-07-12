import React, { useContext } from 'react'
import { shopContext } from '../Context/context'
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrum/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';


const Product = () => {
  const {all_product:all_product_data}= useContext(shopContext); // const all_product_data= all_product;
  // const all_product_data= useContext(shopContext);
  // console.log(all_product_data)
  // const params= useParams(); //{params.passedParameter}
  const {productId}= useParams();//destructuring
  const product= all_product_data.find((e)=>e.id===Number(productId))
  return (
    <div>
      <Breadcrum product={product}/>
      <ProductDisplay product={product}/>
      <DescriptionBox/>
      <RelatedProducts/>
    </div>
  )
}

export default Product
