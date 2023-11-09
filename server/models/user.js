import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Must be a valid username"],
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
      type: String,
      default: "student",
    },
    passcode: {
      type: String,
      required: [true, "Must make a SecretKey"],
      unique: true,
    },
    picturePath: {
      type: String,
      required: [false, "Picture is required"],
      default: "",
    },
    isAdminApprovedAccount: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },

  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;
