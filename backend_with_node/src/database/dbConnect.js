import mongoose from "mongoose";
const databaseURL=process.env.DATABASE_URL;
// const databaseName=process.env.DATABASE_NAME;
// console.log(`${databaseURL}/${databaseName}`)

export const dbConnect=async ()=>{
    try {
        const db=await mongoose.connect(`${databaseURL}`)
        // console.log(db)
        console.log("Ready State:-",db.connections[0].readyState)
    } catch (error) {
        console.log("Error while connecting to database..",error)
        process.exit();
    }
}