import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import router from "./Routes/routes.js";
import { connectDB } from "./Database/db.js";
// import path from "path";
const app=express();
const PORT= 8000;

dotenv.config();

connectDB();
app.use(cookieParser())
app.use(cors({
    origin:"*",
    credentials:true,
}));
app.use(express.json())
app.use("/",router);
app.use(express.urlencoded({extended:false}));

// const _dirname=path.dirname("");
// const buildPath=path.join(_dirname,"../client/build")
// app.use(express.static(buildPath));


app.listen(PORT,()=>{
    console.log(`App Running at http://localhost:${PORT}`);
})