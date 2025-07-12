import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { Product } from "../model/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UploadToCloudinary, deleteCloudinary } from "../utils/cloudinary.js";
import fs from "fs"
import { fileDelete } from "../utils/fileDelete.js";
import { User } from "../model/user.model.js";

const uploadProduct=asyncHandler(async(req ,res)=>{
    
})
const addProduct=asyncHandler(async(req ,res)=>{
    let publicid;
    let productId="";
try {
        let lastProduct = await Product.find({}).sort({id:-1}).limit(1);
        const {name,category,new_price,old_price} =req.body;
        let id=1;
        if(lastProduct.length>0){
            id=lastProduct[0].id+1;
        }
        let filePath=req.file.path;
        let {cloudinary_Url,public_id}= await UploadToCloudinary(filePath);
        publicid=public_id;
        if(cloudinary_Url=="Error"){
            fileDelete(req.file.path);
            return res.status(400).json(
                new ApiError(400,"Failed to upload file , try again uploading the product")
            )
        }
        const product = new Product({
            id:id,
            name:name,
            image:cloudinary_Url,
            category:category,
            new_price:new_price,
            old_price:old_price,
          });
          await product.save();
          productId=product._id;
          fileDelete(req.file.path);
          return res.status(200).json(
            new ApiResponse(200,"Product Successfully Added..")
          )
} catch (error) {
    if(productId!="")
        await Product.findByIdAndDelete(productId);
    console.log("Error in adding product",error);
    await deleteCloudinary(publicid);
    // await cloudinary.uploader.destroy(publicid);
    fileDelete(req.file.path);
    return res.status(400).json(
        new ApiResponse(400,"Something went wrong in adding product")
      )
}
})
const removeproduct=asyncHandler(async (req,res)=>{
    try {
        const{id} =req.body;
        if(id){
            const product=await Product.findOne({id});
            if(!product){
                console.log("Product NOT FOUND" ,product)
                return res.json(
                    new ApiError(400,"Product Not found")
                )
            }
            await Product.findByIdAndDelete(product._id);
            console.log("Removed")
            return res.status(200).json(
                new ApiResponse(200,"Product Removed",[])
            )
        }
        return res.status(400).json(
            new ApiError(400,"Id not found")
        )
    } catch (error) {
        console.log("Error in deleting product",error)
        return res.status(400).json(
            new ApiError(400,"Id not found")
        )
    }
})


const getAllProducts=asyncHandler(async(req,res)=>{
   try {
     const products= await Product.find({});
     if(!products){
         return res.status(500).json(
             new ApiError(500,"No products to display.")
         )
     }
     return res.status(200).json(
         new ApiResponse(200,"Products fetched",products)
     )
   } catch (error) {
    console.error("Error in fetching products",error);
    return res.status(400).json(
        new ApiError(400,"Something went wrong in fetching the products..")
    )
   }
});

const newcollection =asyncHandler(async(req,res)=>{
    try {
        const products= await Product.find({}).sort({id:-1}).limit(20);
        if(!products){
            return res.status(500).json(
                new ApiError(500,"No products to display.")
            )
        }
        return res.status(200).json(
            new ApiResponse(200,"Products fetched",products)
        )
      } catch (error) {
       console.error("Error in fetching products",error);
       return res.status(400).json(
           new ApiError(400,"Something went wrong in fetching the products..")
       )
      }
})

const popularInWomen = asyncHandler(async(req,res)=>{
    try {
        const products= await Product.find({category:"women"}).limit(4);
        if(!products){
            return res.status(500).json(
                new ApiError(500,"No products to display.")
            )
        }
        return res.status(200).json(
            new ApiResponse(200,"Products fetched",products)
        )
      } catch (error) {
       console.error("Error in fetching products",error);
       return res.status(400).json(
           new ApiError(400,"Something went wrong in fetching the products..")
       )
      }
})
const addToCart=asyncHandler(async(req,res)=>{
    //considering that we will get productId and quantity
    const user =req?.user;
    // const product = await Product.findOne({id});

    // const productExists=user.cartData.indexOf(obj=>obj.product==product._id);
    // if(productExists==-1){
    //     user.cartData.push({
    //         product:product._id,
    //         quantity:1
    //     })
    // }else{
    //     user.cartData[productExists].quantity+=1;
    // }
    // const product = await Product.findOne({id});

    const productExists=user.cartData.findIndex(obj=>obj.product==req.body.itemId);
    if(productExists==-1){
        user.cartData.push({
            product:req.body.itemId,
            quantity:1
        })
    }else{
        user.cartData[productExists].quantity+=1;
    }
    const updateduser=await user.save();
    if(!updateduser){
        return res.status(500).json(
            new ApiError(500,"Something went wrong while saving the cart",{})
        )
    }
    return res.status(200).json(
        new ApiResponse(200,"Cart updated successfully",{})
    )
    // user.
    // console.log("req.itemId from frontend:-",req.body.itemId)
    // console.log("User from auth",req.user)
    // res.send(`Test ${req.body.itemId} , User : ${req.user}`)
})

const getCart= asyncHandler(async(req,res)=>{
    const user=req.user;
    return res.status(200)
    .json(
        new ApiResponse(200,"cart fetched successfully",{
            cartData:user.cartData
        })
    )
})
const removeCart= asyncHandler(async(req,res)=>{
    const {itemId}= req.body;
    const user= req?.user;
    console.log(user);
    const index= user.cartData.findIndex(obj=>obj.product==itemId);
    console.log("index",index)
    console.log("cart data",user.cartData)
    if(user.cartData[index].quantity==1){
        user.cartData.splice(index,1);
        console.log("cart 0")

    }
    else{
        user.cartData[index].quantity-=1;
        console.log("cartpresent")
    }
    console.log("Updated user cart data",user.cartData)
    // const updateduser=await user.save();
    const updateduser= await User.findByIdAndUpdate({_id:user._id},
        {
             $set:{cartData:user.cartData}
        },
        {
            new:true
        },
)
    console.log("updateduser",updateduser);
    if(!updateduser){
        return res.status(500).json(
            new ApiError(500,"Something went wrong while removing product from cart",{})
        )
    }
    return res.status(200).json(
        new ApiResponse(200,"Cart updated successfully",{})
    )
})
export {uploadProduct,addProduct,removeproduct,getAllProducts,newcollection,popularInWomen,getCart ,addToCart,removeCart};