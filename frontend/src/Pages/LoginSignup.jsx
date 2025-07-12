import React, { useState } from 'react'
import "./LoginSignup.css"
import { API_URL } from '../constants';
const LoginSignup = () => {
  const Data={
    username:"",
    password:"",
    email:"",
  }
  const [state,setState]=useState("Sign-Up");
  const [formData,setFormData]= useState({
    username:"",
    password:"",
    email:"",
  });
  const changeHandler=(event)=>{
    setFormData({...formData,[event.target.name]:event.target.value});
    // setFormData((prev)=>({...prev,[event.target.id]:event.target.value}));
  }

  const login =async ()=>{
    let responseData = await fetch(API_URL+"/api/user/sign-in",{
      method:"POST",
      headers: { 'Content-Type': 'application/json' },
      body:JSON.stringify(formData)
    })
    //responseData.status==200
    let data= await responseData.json();
    console.log(data)
    if(data.success){
      console.log(data);
      localStorage.setItem("auth-token",data?.data?.AccessToken);
      localStorage.setItem("auth-RefreshToken",data?.data?.RefreshToken);
      localStorage.setItem("role",data?.data?.role);
      window.location.replace("/");
      // console.log(responseData)
      // console.log(responseData,data)
    }
    else{
      alert(data?.responseText);
    }
  }
  const signup =async ()=>{
    
   try {
     let responseData = await fetch(API_URL+"/api/user/sign-up",{
       method:"POST",
       headers: { 'Content-Type': 'application/json' },
       body:JSON.stringify(formData)
     })
     let data= await responseData.json();
     if(data.success){
      setState("Login");
      setFormData(Data);
      //  localStorage.setItem("auth-token",data.token)

      //  window.location.replace("/");
     }
     else{
       alert(data?.responseText);
      console.log(data)
     }
   } catch (error) {

   }
  }
  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-feildsNew">

          {state==="Sign-Up" &&<input type="text" name="username" id="name" value={formData.username} onChange={changeHandler} placeholder='Your Name'/>}
          <input type="email" name="email" id="email" value={formData.email} onChange={changeHandler} placeholder='Email Address'/>
          <input type="password" name="password" id="password" value={formData.password} onChange={changeHandler} placeholder='Password'/>
        </div>
        <button onClick={()=>{state=="Login"?login():signup()}}>Continue</button>
        {
          state==="Sign-Up"?<p className='loginsignup-login'>Already have an account? <span onClick={()=>{setState("Login");setFormData(Data)}}>Login here</span></p>:<p className='loginsignup-login' onClick={()=>{setState("Sign-Up");setFormData(Data)}}>Create an account? <span>Click here</span></p>
        }
        <div className='loginsignup-agree'>
          <input type="checkbox" name='' id=''/>
          <p>By continuing , i agree to the terms of use & privacy</p>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup
