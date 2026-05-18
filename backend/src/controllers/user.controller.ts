import type { CookieOptions, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../model/user.model.js";
import type mongoose from "mongoose";



const generateAccessandRefreshtoken=async(userId:mongoose.Types.ObjectId)=>{
    try{
      const user=await User.findById(userId)
      const accessToken=user!.generateAccessToken()
      const refreshToken=user!.generateRefreshToken()

      user!.refreshToken=refreshToken
      await user!.save({validateBeforeSave:false})

      return {accessToken,refreshToken}
    }
    catch(error:unknown){
      if (error instanceof Error)
        throw new ApiError(500, error.message);
      
      console.log(error);
      throw new ApiError(500,"Something went wrong while generate access and refresh token") 
    }
}



const registerUser = asyncHandler(async (req: Request, res: Response) => {

    try {

        const { name, email, password, role } = req.body;

        if (!name || !email || !password)
            throw new ApiError(400, "All fields are required");

        const existingUser = await User.findOne({ email });

        if (existingUser)
            throw new ApiError(409, "User already exists");

        const createUser = await User.create({
            name,
            email,
            password,
            role,
        });

        const checkUser = await User.findById(createUser._id).select(
            "-password"
        );

        if(!checkUser)
            throw new ApiError(500,"Something went wrong while registering the user")

        return res.status(201).json
        (
            new ApiResponse
            (
                201,
                checkUser,
                "User registered successfully"
            )
        );

    } 
    catch (error: unknown) 
    {

      if (error instanceof Error)
        throw new ApiError(500, error.message);
      
      console.log(error);

      throw new ApiError(500, "Registration failed");
    }
  }
);





const loginUser = asyncHandler(async (req: Request, res: Response) => {

    try {

      const { email, password } = req.body;

      if (!email || !password)
        throw new ApiError(
            400,
            "Some missing field"
        );

      const user = await User.findOne({ email });

      if (!user)
        throw new ApiError(404, "Email is wrong,please try another email");

      const isPasswordCorrect = await user.isPasswordCorrect(password)

      if (!isPasswordCorrect)
        throw new ApiError(401, "Invalid credentials");

      const {accessToken,refreshToken} = await generateAccessandRefreshtoken(user._id);

      const loginUser=await User.findById(user._id).select(
          "-password -refreshToken"
      )

      const option:CookieOptions={
        httpOnly:true,
        secure:true,
        sameSite: "None"   // for cross-site cookie (frontend & backend different domains)
      }

      return res.status(200)
        .cookie("accessToken",accessToken,option)
        .cookie("refreshToken",refreshToken,option)
        .json(
        new ApiResponse(
          200,
          {
            user:loginUser,accessToken,refreshToken
          },
          "Login successfull"
        )
      );

    } catch (error: unknown) {

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ApiError(500, error.message);
      }
      console.log(error);
      throw new ApiError(500, "Login failed");
    }
  }
);



const getCurrentUser=asyncHandler(async(req:Request,res:Response)=>{
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      req.user,
      "Current user fetched successfully"
    )
  )
})



const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  
    try {


      await User.findByIdAndUpdate(
        req?.user?._id,
        {
          $unset:{
            refreshToken:1    //this remove the field from document 
          }
        },
        {
          new:true
        }
      )
      const options: CookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "None"   // for cross-site cookie (frontend & backend different domains)
      };
  
      return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken",options)
        .json(
          new ApiResponse(
            200,
            {},
            "Logout successful"
          )
        );
    } 
    catch (error) {
      if(error instanceof Error)
        throw new ApiError(500,error.message)

      console.log(error);

      throw new ApiError(500, "Login failed");
    }
});




export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser
};
