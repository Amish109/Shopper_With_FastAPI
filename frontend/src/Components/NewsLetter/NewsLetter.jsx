import React from 'react'
import "./NewsLetter.css"

const NewsLetter = () => {
  return (
    <div className='newsleter'>
      <h1>Get Exclusive Offers On Your Email</h1>
      <p>Subscribe to our newletter and stay updated</p>
      <div className='btn-div'>
        <input type="email" placeholder='Your Email id'/>
        <button>Subscribe</button>
      </div>
    </div>
  )
}

export default NewsLetter
