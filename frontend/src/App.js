import './App.css';
import Navbar from './Components/Navbar/Navbar';
// import { createBrowserRouter,RouterProvider,} from "react-router-dom"
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Shop from './Pages/Shop';
import Product from './Pages/Product';
import ShopCategory from './Pages/ShopCategory';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Footer from './Components/Footer/Footer';
import banner_kids from "./Components/Assets/banner_kids.png"
import banner_mens from "./Components/Assets/banner_mens.png"
import banner_womens from "./Components/Assets/banner_women.png"
import { useEffect, useState } from 'react';
// import all_product from './Components/Assets/all_product';
import { shopContext } from './Context/context';
import { API_URL } from './constants';
import Admin from './Components/Admin/Admin';
import AddProduct from './Components/AddProduct/AddProduct';
import ListProduct from './Components/ListProduct/ListProduct';

// function getCartItems(){
//   let cart={};
//   for(let index=0;index<all_product.length+1;index++){
//     cart[index]=0
//   }
//   return cart;
//   // for(let index=1;index<=all_product.length;index++){
//   //   cart[index]=0
//   // }
//   // return cart;
// }
function getCartItems(){
 let cart=[]
//  for(let item=0;item<300+1;item++){
  
//  }
 return cart;
}

function App() {
  const [cartItem,setCartItem]=useState(getCartItems());
  const [all_product,setAll_Product]=useState([]);

  useEffect(()=>{
    fetch(API_URL+"/api/product/getProduct").then((response)=>response.json()).then((data)=>{setAll_Product(data.data);});
    if(localStorage.getItem("auth-token")){
      fetch(API_URL+"/api/product/getCart",{
        method:"POST",
        headers:{
          // Accept:"application/form-data",
          // "auth-token":`${localStorage.getItem("auth-token")}`,
          "Content-Type":"application/json",
          "RequestVerification_AccessToken":localStorage.getItem("auth-token"),
              "RequestVerification_RefreshToken":localStorage.getItem("auth-RefreshToken")
        },
        body:""
      })
      .then((response)=>response.json())
      .then((data)=>{
        // console.error(data);
        if(data.status==401){
          localStorage.removeItem("auth-token");
          localStorage.removeItem("auth-RefreshToken");
          localStorage.removeItem("role");
          window.location.reload();
          return;
        }
        const cartData={};
        data.data.cartData.forEach((element)=>{
          cartData[element.product]=element.quantity
        })
        setCartItem(cartData);
      })
    }
  },[])
  // function addToCart(itemId){
  //   setCartItem((prev)=>({...prev,[itemId]:prev[itemId]+1}))
  // }
  function addToCart(itemId){
    if(localStorage.getItem("auth-token")){
      fetch(API_URL+"/api/product/addToCart",{
        method:"POST",
        headers:{
          // Accept:"application/form-data",
          // "auth-token":`${localStorage.getItem("auth-token")}`,
          "Content-Type":"application/json",
          "RequestVerification_AccessToken":localStorage.getItem("auth-token"),
              "RequestVerification_RefreshToken":localStorage.getItem("auth-RefreshToken")
        },
        body:JSON.stringify({"itemId":itemId})
      }).then((response)=>response.json()).then((data)=>{console.log(data);
      if(data.status==401){
        alert("Session expired please login again to refresh session");
        window.location.replace("/Login");

      }
      else if(data.success==false){
        alert(data.responseText);
      }
      else{
        setCartItem((prev)=>({...prev,[itemId]:prev[itemId]+1||1}));
      }
    })
    }else{
      alert("Please login to perform this action");
      window.location.replace("/Login");

    }
  }
  // console.log(cartItem)
  function removeFromCart(itemId){
    if(localStorage.getItem("auth-token")){
      setCartItem((prev)=>({...prev,[itemId]:prev[itemId]-1}))
      fetch(API_URL+"/api/product/removeCart",{
        method:"POST",
        headers:{
          Accept:"application/form-data",
          // "auth-token":`${localStorage.getItem("auth-token")}`,
          "RequestVerification_AccessToken":localStorage.getItem("auth-token"),
          "RequestVerification_RefreshToken":localStorage.getItem("auth-RefreshToken"),
          "Content-Type":"application/json"
        },
        body:JSON.stringify({"itemId":itemId})
      }).then((response)=>response.json()).then((data)=>console.log(data))
    }else{
      alert("Kindly login to perform this action");
      window.location.replace("/Login");
    }
  }
  function getTotalCartAmount(){
    let totalAmount=0;
    for(let key in cartItem){
      if(cartItem[key]>0 &&all_product.length!==0){
        let itemInfo=all_product.find(x=>x.id===Number(key))
        totalAmount+=itemInfo.new_price*cartItem[key]
      }
    }
    return totalAmount;
  }
  function getTotalCartItem(){
    let totalCart=0;
    for(let key in cartItem){
      if(cartItem[key]>0){
        totalCart+=cartItem[key]
      }
    }
    return totalCart;
  }
  // console.log(cartItem)
  return (
    <div className="App">
      <shopContext.Provider value={{all_product,cartItem,addToCart,removeFromCart,getTotalCartAmount,getTotalCartItem}}>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Shop/>}/>
        <Route path='/mens' element={<ShopCategory category="men" banner={banner_mens}/>}/>
        <Route path='/womens' element={<ShopCategory category="women" banner={banner_womens}/>}/>
        <Route path='/kids' element={<ShopCategory category="kid" banner={banner_kids}/>}/>
        <Route path='/product' element={<Product/>}>
          <Route path=':productId' element={<Product/>}/>
        </Route>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/login' element={<LoginSignup/>}/>
        <Route path='/admin' element={<><Admin/><AddProduct/></>}/>
        <Route path='/addproduct' element={<AddProduct/>}/>
        <Route path='/listproduct' element={<ListProduct/>}/>
      </Routes>
      <Footer/>
      </BrowserRouter>
      </shopContext.Provider>
    </div>
  );
}
export default App;
