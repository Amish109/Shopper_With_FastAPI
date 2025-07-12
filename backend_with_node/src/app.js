import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app= express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.use(cors(
    {
        // origin:["https://shopper-alpha-eight.vercel.app","http://localhost:3000","https://main--amish-porfolio.netlify.app","https://668921434250ed832b5871af--amish-porfolio.netlify.app","http://localhost:5173"],
        origin:["https://shopper-alpha-eight.vercel.app","http://localhost:3000","https://main--amish-porfolio.netlify.app","https://668921434250ed832b5871af--amish-porfolio.netlify.app"],
        methods:["POST","GET"],
        credentials:true
    }
));
// app.use("/product/image",express.static("upload/images"));
app.use("/product/image",express.static("temp/upload/images"));
// Uesr Router
import { userRouter } from "./router/user.router.js";
import productRouter from "./router/products.router.js";
import contactRouter from "./router/contact.router.js";

app.use("/api/user",userRouter);
app.use("/api/product",productRouter);
app.use("/api/contact",contactRouter);
app.get("/",(req,res)=>{
    res.send("Hello world! Express app running on server")
})
export default app;
