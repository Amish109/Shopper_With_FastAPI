
export const asyncHandler =(reqFunction)=>(req,res,next)=>{
    return Promise.resolve(reqFunction(req,res,next)).catch(err=>next(err))
}

// export const asyncHandler=async(reqFunction)=>(req,res,next)=>{
//     return(
//         Promise.resolve(reqFunction(req,res,next)).catch(error=>next(error))
//     )
// } // Was receiving post received an object maybe because we mentioned async as async fun returns a promise

// export const asyncHandler=async(reqFunction)=>(req,res,next)=>{
//     // return(
//         try {
//            return reqFunction(req,res,next)
//         } catch (error) {
//             return next(error)
//         }
//     // )
// }