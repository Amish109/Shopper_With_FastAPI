import dotenv from "dotenv"
dotenv.config({
    path:"../.env"
})
import { dbConnect } from "./database/dbConnect.js";
import app from "./app.js";

const port=process.env.PORT;

dbConnect()
app.listen(port,(error)=>{
    error?console.log("ERROR while creating a server",error):console.log("App Listening on port:",port)
})