import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import router from "./routes/routes.js";
import { connectDB } from "./database/db.js";
const app=express();
const PORT= 8000;

dotenv.config();

connectDB();
app.use(cookieParser())
app.use(cors({
    origin: process.env.PROD_URL,
    credentials:true,
}));
app.use(express.json())
app.use("/",router);
app.use(express.urlencoded({extended:false}));


app.listen(PORT,()=>{
    console.log(`App Running at http://localhost:${PORT}`);
})