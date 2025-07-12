import mongoose from "mongoose"

const contactMeSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
        emailId:{
            type:String,
            required:true,
        },
        message:{
            type:String,
            required:true
        }
    },{timestamps:true}
)

export const ContactMe= mongoose.model("ContactMe",contactMeSchema);