console.log("Configuracion del servidor");


import express from "express";
import cors from "cors";
import fs from "fs";
import mongoose from "mongoose";
const morgan = require("morgan");
require ("dotenv").config();

//create express app
const app=express();

//apply middlewars 
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
require ("dotenv").config
app.use((req,res,next) => {
  console.log("this is my own middleware");
  next();
});

//route
fs.readdirSync("./routes").map((r)=>
app.use("/api", require(`./routes/${r}`))
);
/*app.get("/", (req, res) => {
  res.send('you hit server endpoint')
});*/

//port 
const port= process.env.PORT || 8000;

//db 
mongoose.connect(process.env.DATABASE,
  err => {
      if(err) throw err;
      console.log('connected to MongoDB')
});
/*mongoose
.connect(process.env.DATABASE, {
 userNewUrlParser: true,
 useFindAndModify:false,
 useUnifiedTopolgy:true,
 useCreateIndex:true,
})
.then(()=>console.log("**DBCONNECTED"))
.catch((err)=> console.log("DB CONECCTION ERR=>",err))*/

app.listen(port, () => console.log (`Server is runing on port ${port}`));


