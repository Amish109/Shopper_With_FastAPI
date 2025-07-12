import React, { useContext } from 'react'
import "./CartItems.css"
import { shopContext } from '../../Context/context'
import remove_icon from "../Assets/cart_cross_icon.png"

const CartItems = () => {
    const{all_product,cartItem,addToCart,removeFromCart,getTotalCartAmount} =useContext(shopContext)
  return (
    <div className='cartitems'>
        <div className="cartitems-format-main">
            <p>Products</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
        </div>
        <hr/>
        {all_product.map((e,index)=>{
                if(cartItem[e.id]>0){
                    return( <div key={index}>
                        <div className="cartitems-format cartitems-format-main" id='cartitems-format'>
                            <img src={e.image} alt="" className='carticon-product-icon'/>
                            <p>{e.name}</p>
                            <p>${e.new_price}</p>
                            <button className='cartItems-quantity'>{cartItem[e.id]}</button>
                            <p>${e.new_price*cartItem[e.id]}</p>
                            <img src={remove_icon} className='cartitems-remove-icon' alt="" onClick={()=>removeFromCart(e.id)} />
                        </div>
                        <hr />
                       
                    </div>)
                }
                return null;
            })}
            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>Cart Total</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <p>Shipping Fee</p>
                            <p>Free</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item total">
                            <p>Total</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                    </div>
                    <button>PROCEED TO CHECKOUT</button>
                </div>
                <div className="cartitems-promocode">
                    <p>If you have a promo code, Enter it here</p>
                    <div className="cartitems-promobox">
                        <input type="text" placeholder='promocode.' />
                        <button>Submit</button>
                    </div>
                </div>
            </div>
    </div>
  )
}

export default CartItems
