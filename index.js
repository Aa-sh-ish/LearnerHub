const express = require('express')
const dotenv = require('dotenv')
const mongoose =  require('mongoose')
const app = express()
const port = 6000

const authRouter = require('./routers/auth')


dotenv.config();
console.log(`from env ${process.env.PORT}`)

mongoose.connect(process.env.MONGOURL).then(()=>console.log("db connected")).catch((err)=>console.log(err));

app.use(express.json());
app.use('/api',authRouter);
app.use("/hello", (req, res)=>{
    res.send("Hello")
});


app.listen(process.env.PORT||port, () => console.log(`foodly backend listening on port ${process.env.PORT||port}!`));