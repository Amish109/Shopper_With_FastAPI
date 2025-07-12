import React, { useEffect, useState } from 'react'
// import new_collections from "../Assets/new_collections"
import Item from '../Item/Item'
import "./NewCollections.css"
import { API_URL} from '../../constants'

const NewCollections = () => {
  const [new_collections,setNew_Collection]=useState([]);
  useEffect(()=>{
    fetch(API_URL+"/api/product/newcollections").then((response)=>response.json()).then((data)=>{console.log(data);setNew_Collection(data?.data)})
  },[])
  return (
    <div className='new-collections'>
      <h1>NEW COLLECTIONS</h1>
      <hr/>
      <div className="collectionsItem">
        {new_collections.map((item,index)=>{
            return <Item key={index} id={item.id} image={item.image} name={item.name} new_price={item.new_price} old_price={item.old_price}/>
        })

        }
      </div>
    </div>
  )
}

export default NewCollections
