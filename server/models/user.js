import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Must be a valid username"],
      // unique: true,
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
    role: {
      enum: ["teacher", "student"],
    },
    passcode: {
      type: String,
      required: [true, "Must make a SecretKey"],
      unique: true,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;
