import jwt from 'jsonwebtoken'
import User from '../Models/userAuthoModel.schma.js'
import dotenv from 'dotenv'


dotenv.config()


const authoMiddleware = async (req,res,next) =>{

    const token = req.headers.authorization?.split(' ')[1]  
    if(!token){
        return res.status(401).json({message:"Token is Missing"})
    }
    try {
        const decode = jwt.verify(token,process.env.JWT_SECRET)
        req.user=decode;
        //const user =await  User.findById(req.user._id)
        next();       
    } catch (error) {
        res.status(500).json({message:"registrationUser Error",message: error.message})
    }
}

export default authoMiddleware;