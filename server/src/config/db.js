import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        const connectObj = await mongoose.connect("mongodb://localhost:27017/helpchain");
    } catch (error) {
        console.log("Error connecting to the DB",error)
    }
}

export default connectDB;