import app from "./src/app.js";
import connectDB from "./src/config/db.js";

connectDB().then(()=>{
    console.log("connected to DB!");
})

app.listen(3000,()=>{
    console.log("Server is running on http://localhost:3000");
})
