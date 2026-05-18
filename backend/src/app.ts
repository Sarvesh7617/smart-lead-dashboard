import express from "express";
import cors from "cors";



const app=express();


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))




app.use(express.json())



import userRouter from "./routes/auth.routes.js"; 
import leadRouter from "./routes/lead.routes.js";


app.use('/api/v1/users',userRouter);
app.use('/api/v1/leads',leadRouter);


export {app};