import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

console.log("Environment Variables loaded:");
const PORT = process.env.PORT || 3000;

connectDB().then(()=>{
    console.log("connected to DB!");
})

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})
