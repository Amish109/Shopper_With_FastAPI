import mongoose from "mongoose";
const productSchema= new mongoose.Schema({
      id:{
        type:Number,
        required:true
      },
      name:{
        type:String,
        required:true,
      },
      image:{
        type:String,
        required:true,
      },
      category:{
        type:String,
        required:true,
      },
      new_price:{
        type:Number,
        required:true,
      },
      old_price:{
        type:Number,
        required:true,
      },
      date:{
        type:Date,
        default:Date.now,   //Date will be taken from system current Date while adding product 
      },
      available:{
        type:Boolean,
        default:true,
      }

},
{timestamps:true}
)

export const Product = mongoose.model("Product",productSchema);
