import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from "express";
import User from "../model/user.model.js";


interface jwtPayloadProps{
    _id:string,
    email:string;
}


export const verifyJWT=asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        let token;

        if (req.cookies?.accessToken)
          token = req.cookies.accessToken;


        else if (req.header("Authorization") && req.header("Authorization")?.startsWith("Bearer "))
          token = req.header("Authorization")?.replace("Bearer ", "");


        if(!token)
          throw new ApiError(401,"Unauthorize request")
    
    
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET as string) as jwtPayloadProps
    
        const user=await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        )
    
        if(!user)
          throw new ApiError(401,"Invalid access Token")
    
        req.user=user
        next ();
    } 
    catch (error:unknown) {
        if(error instanceof Error)
            throw new ApiError(401,error?.message || "Invalid access Token");
    }
    
})