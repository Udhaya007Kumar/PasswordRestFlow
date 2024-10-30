import express from "express";
import authoMiddleware from "../Middleware/authoMiddleware.js";
import { LoginUser, registrationUser,userGetById, Userforgotpassword,userRestPassword } from "../Controllers/userAuthoController.js";


const router =express.Router();



router.post("/register",registrationUser)
router.post("/login",LoginUser)
router.post("/forgotpassword",Userforgotpassword)
router.post("/reset-password/:id/:otp",userRestPassword)



router.get("/usergetbyid",authoMiddleware,userGetById)


export default router;