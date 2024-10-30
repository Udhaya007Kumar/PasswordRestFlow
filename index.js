import expres from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './Database/dbconfiq.js';
import userRoute from './Routers/userAuthoRouter.js'


dotenv.config()

const app = expres();

app.use(expres.json());

app.use(cors());

connectDB();

app.get("/",(req,res)=>{
    res.status(200).send("welcome To auther api")
})

app.use("/api/auth",userRoute)

const port = process.env.PORT || 5000

app.listen(port,()=>{
    console.log(`server is statred in our api and Running onthe port  `);    
})

