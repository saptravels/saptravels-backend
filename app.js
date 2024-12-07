const express = require("express")
const app= express()
const dotenv= require("dotenv")
const path= require("path")
const mongodbConnection = require("./config/connectDatabase");
const cors= require('cors');



dotenv.config({path:path.join(__dirname,"config","config.env")})
mongodbConnection();

app.use(cors({
    origin: 'https://saptravel-frontend-deploy.vercel.app/',
    credentials: true
}));

app.get('/hello', (req, res) => {
    res.send('Hello, World!');
  });
  

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.static(path.join(__dirname, 'public')));
// app.use('/controller-images', express.static(path.join(__dirname, 'controllers/public/images')));

// app.use('/public', express.static(path.join(__dirname, 'public')));



const router=require('./Router')

app.use('/api/v1', router)

app.listen(process.env.PORT,()=>{
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`)
})