import mongoose from "mongoose";


const userSchma = new mongoose.Schema({
    username:{
        type:String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      token: String,
      otp:String
})

const User =mongoose.model("User",userSchma)

export default User;