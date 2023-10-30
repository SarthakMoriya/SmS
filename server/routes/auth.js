import express from "express";
import { changePassword, login, signup } from "../controllers/userController.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/changepassword", changePassword);

export default router;
