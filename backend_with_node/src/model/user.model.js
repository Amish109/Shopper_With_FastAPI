import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// const cartDataschema= new mongoose.Schema({
//     product:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"Product",
//     },
//     quantity:{
//         type:Number,
//         default:0
//     }
// })
const cartDataschema= new mongoose.Schema({
    product:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        default:0
    }
})
const userSchema= new mongoose.Schema({
    role:{
        type:String,
        // required:true,
        enum:["admin","user","test_admin"],
        default:"user"
    },
    username:{
        type:String,
        required:[true,"Username is required"],
        lowercase:true,
        unique:true,
        trim:true,
        index:true,
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    cartData:[{
        type:cartDataschema,
        required:true,
        default:[]
    }],
    refreshToken:{
        type:String,
        // default:""
    }

},
{timestamps:true}
)
userSchema.pre("save",async function(next){
    console.log("Pre Save User",this)
    if(!this.isModified("password")){
        console.log("not isModified",this)
        return next()
    }
    this.password=await bcrypt.hash(this.password,10);
    console.log("isModified",this)
    next();
})

userSchema.methods.getAccessToken=function(){
    const data={
        _id:this._id,
        username:this.username,
        email:this.email,
    }
    const AccessToken= jwt.sign(data,process.env.JWT_ACCESSTOKEN_SECRET,{expiresIn:process.env.ACCESSTOKEN_EXPIRY})
    return AccessToken;
}
userSchema.methods.getRefreshToken=function(){
    const data={
        _id:this._id,
    }
    const RefreshToken= jwt.sign(data,process.env.JWT_REFRESHTOKEN_SECRET,{expiresIn:process.env.REFRESHTOKEN_EXPIRY})
    return RefreshToken;
}

export const User = mongoose.model("User",userSchema);