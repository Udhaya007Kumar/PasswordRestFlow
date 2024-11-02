import User from '../Models/userAuthoModel.schma.js'
import bcrypt from "bcrypt";
import jwt  from 'jsonwebtoken'
import dotenv from 'dotenv';
import nodemailer from "nodemailer";



dotenv.config();

//Register authenticator 
export const registrationUser  = async (req,res)=>{
    try {
        const {username, email, password} = req.body;
        const hasPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hasPassword });
        await newUser.save();
        res
        .status(200)
        .json({ message: "User Register Succcesfully", data: newUser });
    } catch (error) {
        res
      .status(500)
      .json({ message: "registrationUser Error ", message: error.message });
    }
}

//Login Authoenticator

export const LoginUser = async (req,res)=>{
    try {
        const {email,password} =req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
          }
        const passwordMatches = await bcrypt.compare(password,user.password);
        if (!passwordMatches) {
            return res.status(404).json({ message: "Invalid Password" });
          }
          //Using TO is Jwt partition 
          const token =jwt.sign({_id:user.id},process.env.JWT_SECRET,{expiresIn:"2h"})
          user.token=token;
          await user.save();
          res.status(200).json({message:"User Logged IN successfully", token: token})
    } catch (error) {
        res
        .status(500)
        .json({ message: "registrationUser Error ", message: error.message });
    }
}




//UserGet method
export const userGetById = async (req,res) =>{
    try {
        const userId =req.user._id;
        const user = await User.findById(userId)
        res.status(200).json({message:"Aithorizes User" ,data:user});
        
    } catch (error) {
        res
      .status(500)
      .json({ message: "registrationUser Error ", message: error.message });
  
    }
}

//forgotpassword




export const Userforgotpassword = async(req,res)=>{
    try {
        const {email} =req.body
        console.log(email);  
       const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message:"User Not Found"})
        }
        console.log(user);
    ///Random String
     const randomMailString = Math.random().toString(36).substring(2,7);
     user.otp=randomMailString
     await user.save();   
    //  const token =jwt.sign(randomMailString,process.env.JWT_SECRET,{expiresIn:"20s"})
    const otp = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
     ////Node mailer Used in Script 
     const transporter = nodemailer.createTransport({
        //Gmail or yahoo or outlook
        service: "Gmail",
        auth: {
          user: process.env.PASS_MAIL,
          pass: process.env.PASS_KEY,
        },
      });
      const mailOptions = {
        from: process.env.PASS_MAIL,
        to: user.email,
        subject: "Password Reset Link",
        text: `You are receiving this because you have requested the reset of the password for your account 
        Please click the following link or paste it into your browser to complete the process
        https://mellifluous-stardust-3751e4.netlify.app/reset-password/${user._id}/${otp}`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res
            .status(500)
            .json({ message: "Internal server error in sending the mail" });
        } else {
          res.status(200).json({ message: "Email Sent Successfully" });
        }
      });
        
    } catch (error) {
        res
        .status(500)
        .json({ message: "registrationUser Error ", message: error.message });
    }
}






//RestPassword 
export const userRestPassword = async (req, res) => {
  const { id, otp } = req.params;
  const { password } = req.body;

  // console.log("Received password:", password);
  // console.log("Received user ID:", id);
  // console.log("OTP being verified:", otp);
  const user = await User.findById(id);
  if (!user) {
      return res.status(404).json({ message: "User not found" });
  }
  

  try {
      const decoded = jwt.verify(otp, process.env.JWT_SECRET ,{ expiresIn: '10m' });
      if (!decoded) {
          return res.status(400).json({ message: "Invalid OTP" });
      }


     

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.otp = null; // Optionally clear the OTP after use
      await user.save();

      res.status(200).json({ message: "Password successfully reset" });
  } catch (error) {
      console.error("Error details:", error); // Log the error for debugging
      res.status(500).json({ message: "Error resetting password", error: error.message });
  }
};
