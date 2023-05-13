console.log("Configuracion del servidor");


import express from "express";
import cors from "cors";
import fs from "fs";
import mongoose from "mongoose";
import csrf from "csurf";
import cookieParser from "cookie-parser";
const morgan = require("morgan");

require ("dotenv").config();

const csrfProtection = csrf({ cookie: true });
//create express app
const app=express();

//apply middlewars 
app.use(cors());
app.use(express.json());
app.use(cookieParser());
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

// csrf
app.use(csrfProtection);

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});


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


