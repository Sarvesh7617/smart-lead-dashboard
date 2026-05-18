import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import mongoose, { Schema, Document} from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "sales";
  refreshToken:string

  isPasswordCorrect(password: string): Promise<boolean>;

  generateAccessToken(): string;

  generateRefreshToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "sales"],
      default: "sales",
    },
    refreshToken:{
        type:String
    }
  },{timestamps: true,});


userSchema.pre<IUser>("save",async function () 
  {
    if(!this.isModified("password"))
      return;
    this.password=await bcrypt.hash(this.password,10)
  }
)


userSchema.methods.isPasswordCorrect=async function(password:string):Promise<boolean>
{
    return await bcrypt.compare(password,this.password);         //decrpty then compare
}



userSchema.methods.generateAccessToken=function()
{
    return jwt.sign(
        {
            _id:this._id,
            email:this.email
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY as string
        }
    )
}


userSchema.methods.generateRefreshToken=function()
{
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET as string,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY as string
        }
    )
}

const User = mongoose.model<IUser>("User", userSchema);

export default User;