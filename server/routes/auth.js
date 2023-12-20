import express from "express";
import { adminLogin, approveAccounts, changePasscode, changePassword, deleteUnapprovedAccounts, forgotPassword, getAllAccounts, getUnapprovedAccounts, login, signup, verifyAccount, verifyEmail } from "../controllers/userController.js";


const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/changepassword", changePassword);
router.post("/forgotpassword", forgotPassword);
router.post("/changepasscode", changePasscode);
router.post("/verifyemail",verifyEmail)
router.post("/verifyaccount",verifyAccount)
router.post("/admin/login", adminLogin);
router.get("/admin/approveaccounts/:id",approveAccounts)
router.get("/admin/getunapprovedaccounts",getUnapprovedAccounts)
router.get("/admin/deleteunapproveaccount/:id",deleteUnapprovedAccounts)
router.get("/admin/getallaccounts",getAllAccounts)

export default router;
