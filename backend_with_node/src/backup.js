const port=4000;
const express= require("express");
// Initializing Dependencies
const cors= require("cors");
const jwt= require("jsonwebtoken");
const mongoose= require("mongoose");
const multer= require("multer");
const path= require("path");

const app= express();
app.listen(port,(error)=>{
  error?console.log("Error",error):console.log("App Running on Port:",port);
});

//Get Request for port 4000
app.get("/",(request,response)=>{
  response.send(`Hello World, Express App Running on Port: ${port}`)
});

app.use(express.json()); // converting all the response to json 
app.use(cors());  //To connect with React.js


// ======= File engine using Multer ========
//--creating diskstorage
const storage=multer.diskStorage({
  destination:"./upload/images",
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
  }
});

//--creating upload middleware
const upload = multer({storage:storage});

// Middleware for showing static files in images folder
app.use("/images",express.static("upload/images"));

// Handling File post
app.post("/upload",upload.single("product"),(request,response)=>{
  response.json({
    success:1,
    image_url: `http://localhost:${port}/images/${request.file.filename}`
  })
});

// Creating Mongodb Database
mongoose.connect("mongodb+srv://amviie:%40mIsh786@cluster0.2mryrya.mongodb.net/Ecommerce"); //Ecommerce is collection name

//=================== Creating Upload Products =============
// When we had to add an object to database we have to create a schema for that
//schema for creating products
const Product=mongoose.model("Product",{    // mongoose.model("schema_name",{object}) //Defining Product Model in schema
  id:{
    type:Number,
    required:true,     //If there is no id it wont add in database
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
  //We will use this schema to add product in database

});

//API Handling adding product 
app.post("/addproduct",async(req,resp)=>{
  let products = await Product.find({});
  let id;
  if(products.length>0){

    // let last_product_array=products.slice(-1);
    // let last_product= last_product_array[0];
    // id=last_product.id+1;
    let last_product = products[products.length-1];
    id=last_product.id+1;
    // or maybe last_product = products[products.length-1];
  }else{
    id=1
  }
  const product = new Product({
    id:id,
    name:req.body.name,
    image:req.body.image,
    category:req.body.category,
    new_price:req.body.new_price,
    old_price:req.body.old_price,
  });
  console.log(product);
  await product.save();
  console.log("saved")
  resp.json({
    success:1,
    name:req.body.name
  });
})

// app.post("/addproduct",async (request,response)=>{
//   const product =new Product();
//   product.id=request.body.id;
//   product.name=request.body.name;
//   product.image=request.body.image;
//   product.category=request.body.category;
//   product.new_price=request.body.new_price;
//   product.old_price=request.body.old_price;
//   await product.save();
//   console.log("Saved..");
//   response.json({
//     success:1,
//     name:request.body.name
//   })
// });



//Creating API For Deleting the product from Database 
app.post("/removeproduct",async (req,res)=>{
  // debugger
  await Product.findOneAndDelete({id:req.body.id});
  console.log("Removed");
  res.json({
    success:true,
    name:req.body.name
  })
  /*  Product.findOneAndDelete({id:req.body.id}).then((value)=>{
    console.log("Removed");
    res.json({
      success:true,
      name:req.body.name
    })
  }); */
});

// Creating an API for getting all products
app.get("/allproducts",async (req,res)=>{
 let products= await Product.find({});
 console.log("All Product fetched")
 res.json({
  success:1,
  data:products
 })
});

//Schema Creating for user model

const Users=mongoose.model("user",{
  username:{
    type:String,
    // required:true,
  },
  email:{
    type:String,
    unique:true,
  },
  password:{
    type:String,
  },
  cartData:{
    type:Object,
  },
  date:{
    type:Date,
    default:Date.now,
  }
});

// Creating end-point for Creating Users
app.post("/signup",async (req,res)=>{
  let check = await Users.findOne({email:req.body.email});
  if(check){
    return res.status(400).json({success:false,errors:"Existing user found with same email id"})
  }
  
  let cart={};
  for(let i=0;i<300;i++){
    cart[i]=0;  
  }
  const user= new Users({
    username:req.body.username,
    email:req.body.email,
    password:req.body.password,
    cartData:cart
  });
  await user.save();
  console.log("User Saved")
  // console.log(user)
  const data={
    user:{
      id:user.id,
    }
  }
  const token = jwt.sign(data,"secret_ecom")
  res.json({
    success:1,
    token
  })
})

//Endpoint for User Login
app.post("/login",async (req,res)=>{
  debugger;
  let user = await Users.findOne({email:req.body.email});
  if(user){
    const passCompare= req.body.password === user.password;
    if(passCompare){
      console.log("Password matcged")
      const data={
        user:{
          id:user.id
        }
      }
      const token = jwt.sign(data,"secret_ecom");
      res.json({
        success:true,
        token,
      })
    }else{
      res.json({
        success:false,
        errors:"Wrong password",
      })
    }
  }
  else{
    console.log("under else")
    res.json({
      success:false,
      errors:"User does not exist",
    })
  }
})


//creating an end-point for new collection data
app.get('/newcollections',async (req,res)=>{
  let products =await Product.find({});
  let newcollection = products.slice(1).slice(-8);// Or products.slice(-8)
  console.log("New Collection Fetched");
  res.send(newcollection)
});

//Creating End-Point for Popular in Women
app.get('/popularInWomen',async (req,res)=>{
  let products =await Product.find({category:"women"});
  let popularInWomen = products.slice(0,4);
  console.log("Popular In Women Fetched");
  res.send(popularInWomen)
});

//Creating middle-ware to fetch user from the auth token
const fetchUser= async(req,res,next)=>{
  const token= req.header("auth-token");
  if(!token){
    res.status(401).send({errors:"Please authenticate using valid token"})
  }else{
    try{
      const data=jwt.verify(token,"secret_ecom");
      req.user=data.user;
      next();
    }catch(error){
      res.status(401).send({errors:"Please authenticate using valid token"})
    }
  }
}

// Pending for update

//End-Point for Add to cart
app.post("/addToCart",fetchUser,async (req,res)=>{
  console.log("added",req.body.itemId);
  let userData = await Users.findOne({_id:req.user.id}); //finding the user with the id given by mongodb
  userData.cartData[req.body.itemId]+=1; //changing the cartData of the user 
  await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData}) //updating the useer to mongodb
  res.send("Added")
});

//Creating End-point to remove data from Cart
app.post("/removeFromCart",fetchUser,async (req,res)=>{
  console.log("removed",req.body.itemId);
  let userData = await Users.findOne({_id:req.user.id}); //finding the user with the id given by mongodb
  if(userData.cartData[req.body.itemId]>0)
  userData.cartData[req.body.itemId]-=1; //changing the cartData of the user 
  await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData}) //updating the useer to mongodb
  res.send("Removed");
});

//Creating End-Point to get Cart Data
app.post("/getCart",fetchUser,async (req,res)=>{
  console.log("Get Cart");
  let userData= await Users.findOne({_id:req.user.id});
  res.json(userData.cartData)
})