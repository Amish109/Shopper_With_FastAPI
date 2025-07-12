// import React, { useEffect, useState } from 'react'
// import "./ListProduct.css"
// import cross_icon from "../../assets/cross_icon.png"
// import { API_URL } from '../../../../frontend/src/constants'

// const ListProduct = () => {
//   const [allproducts,setAllproducts]=useState([]);
//   const fetchInfo=async ()=>{
//     let response=await fetch(API_URL+"/api/product/allproducts");
//     let {data}=await response.json();
//     console.log(data)
//     setAllproducts(data);
//   }
//   useEffect(()=>{
//     fetchInfo();
//     // console.log(allproducts)
//   },[])
//   const remove_product= async (id)=>{
//     let response=await fetch(API_URL+"/api/product/removeproduct",{
//       method:"POST",
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json'
//       },
//       body:JSON.stringify({id:id})
//     })
//     let result= await response.json();
//     // console.log(result)
//     await fetchInfo();
//   }

//   return (
//     <div className='list-product'>
//       <h1>All Products List</h1>
//       <div className="listproduct-format-main">
//         <p>Products</p>
//         <p>Title</p>
//         <p>Old Price</p>
//         <p>New Price</p>
//         <p>Category</p>
//         <p>Remove</p>
//       </div>
//       <div className="listproduct-allproduct">
//         <hr />
//         {
//           allproducts.map((product,key)=>{
//             return(
//               <div key={key}>
//               <div className="listproduct-format-main listproduct-format">
//                 <img src={product.image} alt="" className='listproduct-product-icon'/>
//                 <p>{product.name}</p>
//                 <p>${product.old_price}</p>
//                 <p>${product.new_price}</p>
//                 <p>${product.category}</p>
//                 <img src={cross_icon} alt="" className='listproduct-remove-icon' onClick={()=>{remove_product(product.id)}}/>

//               </div>
//               <hr />
//               </div>
//             )
//           })
//         }
//       </div>
//     </div>
//   )
// }

// export default ListProduct
