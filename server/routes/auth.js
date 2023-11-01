import express from "express";
import { changePasscode, changePassword, login, signup } from "../controllers/userController.js";

const router = express.Router();

router.post("/login", login);
router.post("/changepassword", changePassword);
router.post("/changepasscode", changePasscode);

export default router;
