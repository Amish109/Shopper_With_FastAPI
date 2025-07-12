import jwt from "jsonwebtoken"
import { User } from "../model/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const Authjs=asyncHandler(async(req,res,next)=>{
    console.log("Headers1",req.get("RequestVerification_AccessToken"));
    console.log("Headers2",req.get("RequestVerification_RefreshToken"));
    console.log("Headers2",req.header);
    console.log("Headers3",req.headers);
    // const AccessToken=req.cookies.AccessToken || req.get("RequestVerification_AccessToken");
    const AccessToken=req.get("RequestVerification_AccessToken");
    console.log(AccessToken)
    // const RefreshToken=req.cookies.RefreshToken|| req.RequestVerification_RefreshToken
    const userJWT= jwt.verify(AccessToken,process.env.JWT_ACCESSTOKEN_SECRET);
    console.log("userJWT",userJWT)
    const {_id}= jwt.verify(AccessToken,process.env.JWT_ACCESSTOKEN_SECRET);
    console.log("id of jwt",_id)

    const user= await User.findById(_id).select("-password -refreshToken");
    if(!user){
        // const {_id}= jwt.verify(RefreshToken,process.env.JWT_REFRESHTOKEN_SECRET);
        // const userToRefreshSession= await User.findById(_id).select("-password -refreshToken");
        // if(!userToRefreshSession){
            return res.status(401).json(
                new ApiError(401,"User is not logged in !!")
            )
        // }else{
            
        // }
    }
    req.user=user;
    next();
})
export default Authjs;


// async (req,res,next)=>{
//     console.log("Cookies",req)
//     const AccessToken=req.cookies.AccessToken;
//     const RefreshToken=req.cookies.RefreshToken;
//     const {_id}= jwt.verify(AccessToken,process.env.JWT_ACCESSTOKEN_SECRET);
//     const user= await User.findById(_id).select("-password -refreshToken");
//     if(!user){
//         return res.status(401).json(
//             new ApiError(401,"User is not logged in !!")
//         )
//     }
//     req.user=user;
//     next();
// }