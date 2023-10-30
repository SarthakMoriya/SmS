import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Must be a valid username"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "User must have a password"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Must be unique Email"],
      unique: true,
    },
    role:{
      enum:['teacher','student']
      
    }
  },
  { timestamps: true }
);
const User=  mongoose.model('User',userSchema)
export default User
