import express from "express";
import { adminLogin, approveAccounts,editImage, changePasscode, changePassword, deleteUnapprovedAccounts, forgotPassword, getAllAccounts, getUnapprovedAccounts, login, signup, verifyAccount, verifyEmail } from "../controllers/userController.js";
import { checkToken } from "../middlewares/admin.js";


const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/changepassword", changePassword);
router.post("/forgotpassword", forgotPassword);
router.post("/changepasscode", changePasscode);
router.post("/verifyemail",verifyEmail)
router.post("/verifyaccount",verifyAccount)
router.post("/admin/login", adminLogin);
router.get("/admin/approveaccounts/:id",checkToken,approveAccounts)
router.get("/admin/getunapprovedaccounts",getUnapprovedAccounts)
router.get("/admin/deleteunapproveaccount/:id",checkToken,deleteUnapprovedAccounts)
router.get("/admin/getallaccounts",getAllAccounts)
router.post('/editimage/:id',editImage)

export default router;
