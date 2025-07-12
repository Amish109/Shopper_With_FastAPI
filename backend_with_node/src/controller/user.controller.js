import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../model/user.model.js"
import bcrypt from "bcryptjs"

export const getAccessAndRefreshToken=(user)=>{
   try {
     const AccessToken= user.getAccessToken();
     const RefreshToken= user.getRefreshToken();
     user.refreshToken=RefreshToken
     Promise.resolve(user.save({validateBeforeSave:false})).catch((error)=>console.log(error))
     return {
         AccessToken,RefreshToken
     }
   } catch (error) {
    return Response.status(500).json({
        status:500,
        message:"omething went wrong in generating token",
        data:{},
        success:false
    })
   }
}
const cookieOption={
    
    httpOnly: true,
    secure: true,
}
const signUp= asyncHandler(async (req,res)=>{
    const {username,email,password}= req.body;
    console.log("Data from signup",username,email,password)
    if([username,email,password].some((element,index)=>element=="")){
            return res.status(400).json(
                new ApiError(400,"Input fields are required")
            )
    }
    const user=await User.findOne({
        $or:[{email},{username}]
    })
    if(user){
        return res.status(400).json(
            new ApiError(400,"User Already exists.")
        )
    }

    // const new_user=new User({
    //     username,
    //     email,
    //     password,
    // })
    // const createdUser=await new_user.save();
   const createdUser=await User.create({
        username,
        email,
        password,
    })
    
    return res.status(200).json(
        new ApiResponse(200,"User Registered Successfully")
    )
    // res.send("OK")
})

const signIn= asyncHandler(async(req,res)=>{
    // let {username,email,password} = req.body;
    let {email,password} = req.body;
    console.log("Data from Login",email,password)
    if([email,password].some((element,index)=>element=="")){
        return res.status(400).json(
            new ApiError(200,"Input fields cant be empty..")
        )
    }
    const user= await User.findOne({
        // $or:[{username},{email}]
        email
    })
 
    if(!user){
        return res.status(400).json(
            new ApiError(400,"User Does not exists!!")
        )
    }
    const comparePassword= await bcrypt.compare(password,user.password);
    console.log(comparePassword);
    if(!comparePassword){
        return res.status(400).json(
            new ApiError(400,"Wrong Password!!")
        )
    }
    const {AccessToken,RefreshToken}=getAccessAndRefreshToken(user);
    console.log(AccessToken,RefreshToken);
    console.log("user",user);
   return res
    .status(200)
    .cookie("access_token",AccessToken,cookieOption)
    .cookie("refresh_token",RefreshToken,cookieOption)
    .json(
        new ApiResponse(200,"Logged in successfully",{
            AccessToken,RefreshToken,role:user.role
        })
    )
});

const signOut= asyncHandler(async(req,res)=>{
    try {
        const user= req?.user;
        user.refreshToken=null;
        const updatedUser=await user.save({validateBeforeSave:false});
        return res.status(200).clearCookie("AccessToken",cookieOption).clearCookie("RefreshToken",cookieOption).json(
            new ApiResponse(200,"Logged-out successfully")
        )
    } catch (error) {
        return res.status(400).json(
            new ApiResponse(400,"Something went wrong..")
        )
    }
})

const checkCode=asyncHandler((req,res)=>{
    console.log(req)
})
export {signUp,signIn,signOut,checkCode}