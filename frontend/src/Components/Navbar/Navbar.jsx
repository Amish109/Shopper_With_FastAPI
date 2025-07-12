import {React,useContext,useRef,useState} from 'react'
import { NavLink } from 'react-router-dom'
import "./Navbar.css"
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { shopContext } from '../../Context/context'
import nav_dropdown from "../Assets/arrow_icon.svg"
import { API_URL } from '../../constants'

const Navbar = () => {
    const menuRef= useRef();
    const [menu,setMenu]=useState("Shop")
    const{getTotalCartItem}=useContext(shopContext)

    const dropDownToggle=(e)=>{
      menuRef.current.classList.toggle("nav-menu-visible")
      e.target.classList.toggle("open")
    }
  return (
    <div className='navbar'>
       <div className="nav-logo">
        <img src={logo} alt="logo" />
        <p>Shopper </p>
       </div>
       <img onClick={(event)=>dropDownToggle(event)} className='nav-dropdown' src={nav_dropdown} alt="" />
       <ul ref={menuRef} className='nav-menu'>
       <li><NavLink to="/" className={({ isActive }) => (isActive ? setMenu("Shop")
        : '')}>Shop{menu=="Shop"?<hr/>:<></>}</NavLink></li>
       <li > <NavLink to="/mens" className={({ isActive }) => (isActive ? setMenu("Men") : '')}>Men{menu=="Men"?<hr/>:<></>}</NavLink></li>
       <li > <NavLink to="/womens" className={({ isActive }) => (isActive ? setMenu("Women") : '')}>Women{menu=="Women"?<hr/>:<></>}</NavLink></li>
       <li ><NavLink to="/kids" className={({ isActive }) => (isActive ? setMenu("Kids") : '')}>Kids{menu=="Kids"?<hr/>:<></>}</NavLink></li>
       {
       localStorage.getItem("role")=="admin" &&  <li ><NavLink to="/admin" className={({ isActive }) => (isActive ? setMenu("Admin") : '')}>Admin{menu=="Admin"?<hr/>:<></>}</NavLink></li>
       }
        {/* <li onClick={()=>setMenu("Men")}><NavLink to="/mens">Men</NavLink>{menu=="Men"?<hr/>:<></>}</li>
        <li onClick={()=>setMenu("Women")}><NavLink to="/womens">Women</NavLink>{menu=="Women"?<hr/>:<></>}</li>
        <li onClick={()=>setMenu("Kids")}><NavLink to="/kids">Kids</NavLink>{menu=="Kids"?<hr/>:<></>}</li> */}
       </ul>
       <div className="nav-login-cart">
       {
        localStorage.getItem("auth-token")?<button onClick={async()=>{
          const response= await fetch(API_URL+"/api/user/sign-out",{
            method:"POST",
            headers: {
              "Content-Type": "application/json",
              "RequestVerification_AccessToken":localStorage.getItem("auth-token"),
              "RequestVerification_RefreshToken":localStorage.getItem("auth-RefreshToken")
            },
                    // method:"POST",
            // headers: {
            //   "Content-Type": "application/json",
            //   "Authorization":`Bearer ${localStorage.getItem("auth-token")}`,
            //   // "RequestVerification_RefreshToken":localStorage.getItem("auth-RefreshToken")

          });
          const data= await response.json();
          alert(data.responseText);
          data.success&&localStorage.removeItem("auth-token");localStorage.removeItem("auth-RefreshToken");localStorage.removeItem("role");window.location.replace("/")}}>Logout</button>: <button onClick={()=>setMenu("login")}><NavLink to="/login">Login</NavLink></button>
       }
       <NavLink to={localStorage.getItem("auth-token")?"/cart":"/login"}> <img src={cart_icon} alt="AddToCart" onClick={()=>setMenu("cart")}/></NavLink>
        <div className='nav-cart-count'>{getTotalCartItem()}</div>
       </div>
    </div>
  )
}

export default Navbar
