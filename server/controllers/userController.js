import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// SIGNUP
export const signup = async (req, res) => {
  try {
    console.log(req.body);
    const { username, password, email, passcode, picturePath } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Existing User! Provide a Unique Email Address",
        ok: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
      passcode,
      picturePath,
    });

    // You should not call User.save() here, as you have already created the user.

    res.status(200).json({ message: "Account Created!" });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(400).json({
      message: "Error creating account",
      error: error.message,
      ok: false,
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    console.log("hi");
    const { email, password } = req.body;
    console.log(email,password);
    const isValidUser = await User.findOne({ email });
    if (!isValidUser) {
      return res.status(403).json({ message: "Invalid Credentials!",error:"Invalid Email" });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      isValidUser.password
    );

    if (!isValidPassword) {
      return res.status(403).json({ message: "Invalid Credentials!",error:"Wrong password" });
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
    return res.status(500).json({ message: "Error creating account",error: error });
  }
};

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const existingUser = await User.findById(req.body.id);

    if (!existingUser)
      return res
        .status(400)
        .json({ message: "Invalid Acccount! Please try again", ok: false });

    const isCorrectpassword = await bcrypt.compare(
      oldPassword,
      existingUser.password
    );
    if (!isCorrectpassword)
      return res
        .status(400)
        .json({ message: "Invalid Old Password! Please try again", ok: false });

    const updatedPassword = await bcrypt.hash(newPassword, 10);
    existingUser.password = updatedPassword;
    await existingUser.save();
    res.status(200).json({ message: "Password saved successfully!", ok: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CHANGE PASSCODE

export const changePasscode = async (req, res) => {
  try {
    const { id, oldPasscode, newPasscode } = req.body;

    const existingUser = await User.findById(id);

    if (!existingUser)
      return res
        .status(400)
        .json({ message: "Invalid Acccount! Please try again", ok: false });

    const isValidPasscode = existingUser.passcode === oldPasscode;

    if (!isValidPasscode) {
      return res
        .status(400)
        .json({ message: "Wrong Passcode! Please try again", ok: false });
    }

    existingUser.passcode = newPasscode;
    await existingUser.save();

    res.status(200).json({ message: "Passcode Updated", ok: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, ok: false });
  }
};
