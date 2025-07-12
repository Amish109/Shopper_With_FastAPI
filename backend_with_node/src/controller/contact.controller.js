import { ContactMe } from "../model/contactMe.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const sendMessage =asyncHandler(async(req,res)=>{
    console.log("req.body",req.body)
    console.log("req.data",req.data)
 try {
       const {name,emailId,message}= req.body;
        console.log("name,emailId,message",name,emailId,message)

       if([name,emailId,message].some((element)=>element=="")){
           return res.status(400).json(
               new ApiError(400,"Fields cant be empty",{})
           )
       }
       const contactMessage= new ContactMe({
           name,emailId,message
       })
   
       const savedContactMessage=await contactMessage.save();
       return res.status(200).json(
        new ApiResponse(200,"Message Sent Successfully",savedContactMessage)
       )
 } catch (error) {
    console.log("Error in sending message",error)
    return res.status(400).json(
        new ApiError(400,"Fields cant be empty",{})
    )
 }
})

export {sendMessage}