const authJwt=(req,res,next)=>{
    console.log("AccessToken",req.cookies.AccessToken)
    console.log("RefreshToken",req.cookies.RefreshToken)
    next();
}
export {authJwt}