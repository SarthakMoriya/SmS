import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendOtp } from "../utils/otpService.js";
import "dotenv/config";
// SIGNUP
export const signup = async (req, res) => {
  try {
    const { username, password, email, passcode, picturePath } = req.body;
    const existingUser = await User.findOne({ email });
    const isSamePasscode = await User.findOne({ passcode });

    if (existingUser) {
      return res.status(400).json({
        message: "Existing User! Provide a Unique Email Address",
        ok: false,
      });
    }
    //Check Unique Secret Key
    if (isSamePasscode) {
      return res
        .status(400)
        .json({ message: "Please Provide Unique Secret Key", ok: false });
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
    const { email, password } = req.body;
    const isValidUser = await User.findOne({ email });
    if (!isValidUser) {
      return res.status(403).json({
        message: "Invalid Credentials!",
        error: "Invalid Email",
        ok: false,
      });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      isValidUser.password
    );

    if (!isValidPassword) {
      return res.status(403).json({
        message: "Invalid Credentials!",
        error: "Wrong password",
        ok: false,
      });
    }

    const token = jwt.sign(
      { id: isValidUser._id, email: isValidUser.email },
      process.env.JWT_PASSWORD,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      token,
      user: isValidUser,
      ok: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating account", error: error, ok: false });
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

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { password, email } = req.body;
    const isValidEmail = await User.findOne({ email: email });
    if (!isValidEmail)
      return res.status(403).json({ message: "Invalid Email", ok: false });

    const hashedPassword = await bcrypt.hash(password, 12);
    isValidEmail.password = hashedPassword;
    await isValidEmail.save();
    res.status(200).json({ message: "Password saved", ok: true });
  } catch (error) {
    res.status(500).json({ message: "ERROR UPDATING PASSWORD", ok: false });
  }
};

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

// VERIFY EMAIL

export const verifyEmail = (req, res) => {
  try {
    const { email } = req.body;
    const data = sendOtp({ email });

    res
      .status(200)
      .json({ message: "OTP sent successfully", ok: true, otp: data.otp });
  } catch (error) {
    res.status(500).json({ message: "Failed to verify email", ok: false });
  }
};

//VERIFY ACCOUNT AFTER OPT
export const verifyAccount = async (req, res) => {
  try {
    const id = req.body.id;
    console.log(id);
    const user = await User.findById(id);
    if (!user) return res.status(404).send({ message: "User not found" });
    user.verified = true;
    await user.save();
    console.log(user);
    res.status(200).send("OK");
  } catch (error) {
    res.status(400).send("error");
  }
};

// ADMIN LOGIN
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === "sarthak8544@gmail.com" && password === "test") {
      const isAdmin = await User.findOne({ email });
      if (!isAdmin) return res.status(404).send("Invalid Credentials");

      const token = jwt.sign({ id: isAdmin._id, email }, "topendseretpassword");

      return res
        .status(200)
        .json({ token, user: isAdmin, admin: true, secretkey: 1234 });
    } else {
      return res.status(500).json("Invalid Credentials");
    }
  } catch (error) {
    res.status(500).json({ error: "Invalid Credentials" });
  }
};

// ACCOUNTS TO BE APPROVED BY ADMIN

export const approveAccounts = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await User.findById(id);
    if (!account)
      return res.status(404).json({ error: "Invalid Teacher Account!" });
    account.isAdminApprovedAccount = true;
    await account.save();
    res.send({});
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

//  UNAPPROVED ACCOUNTS
export const getUnapprovedAccounts = async (req, res) => {
  try {
    const unapprovedAccounts = await User.find({
      isAdminApprovedAccount: false,
    });

    res.send(unapprovedAccounts || []);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// REJECT A TEACHER ACCOUNT
export const deleteUnapprovedAccounts = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.send("Teacher Account deleted");
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// GET ALL TYPES OF ACCOUNTS

export const getAllAccounts = async (req, res) => {
  const accounts = await User.find({ role: "student" });
  res.send(accounts);
};

export const editImage = async (req, res) => {
  try {
    const user = await User.findById( req.params.id);
  console.log(req.body);
  user.picturePath = req.body.picturePath
  await user.save()
  res.status(200).send("Image Updated")
  } catch (error) {
    res.status(500).send("error")
  }
};
