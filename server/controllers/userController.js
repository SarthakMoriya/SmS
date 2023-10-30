import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    console.log("Signup request")
    const { username, password, email,passcode } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Existing User! Provide a Unique Email Address",ok:false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
      passcode
    });

    // You should not call User.save() here, as you have already created the user.

    res.status(200).json({ message: "Account Created!" });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(400).json({ message: "Error creating account", error: error.message,ok:false })
  }
};

export const login = async (req, res) => {
  try {
    console.log("hi");
    const { email, password } = req.body;
    const isValidUser = await User.findOne({ email });
    if (!isValidUser) {
      return res.status(403).json({ message: "Invalid Credentials!" });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      isValidUser.password
    );

    if (!isValidPassword) {
      return res.status(403).json({ message: "Invalid Credentials!" });
    }

    const token = jwt.sign(
      { id: isValidUser._id, email: isValidUser.email },
      "topendseretpassword",
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      token,
      user: isValidUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error creating account" });
  }
};


export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const existingUser = await User.findById(req.body.id);

    if (!existingUser)
      res.status(400).json({ message: "Invalid Acccount! Please try again" });

    const isCorrectpassword = await bcrypt.compare(
      oldPassword,
      existingUser.password
    );
    if (!isCorrectpassword)
      res
        .status(400)
        .json({ message: "Invalid Old Password! Please try again" });

    const updatedPassword = await bcrypt.hash(newPassword, 10);
    existingUser.password = updatedPassword;
    await existingUser.save();
    res.status(200).json({ message: "Paasword saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
