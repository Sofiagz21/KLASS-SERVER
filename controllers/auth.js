import User from "../models/user";
import { hashPassword, comparePassword} from "../utils/auth";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try{ // codigo que puede manejar errores
    //console.log(req.body);
    const {name,lastName,email,password}= req.body; 
    //validation
    
    if(!name)     return res.status(400).send("Tu nombre es requerido");
    if(!lastName) return res.status(400).send("Tu apellido es requerido");
    if(!password || password.length <6){
      return res.status(400).send('La contraseña es requerida y debe tener al menos 6 caracteres');
    } 
    let userExist = await User.findOne({email}).exec();
    if(userExist)   return res.status(400).send("Ya existe este correo electronico");
    
    // hash password
    const hashedPassword = await hashPassword(password); // Esto transforma la contraseña a encriptacion

    
    //register
    const user = new User({
      name,
      lastName,
      email,
      password: hashedPassword,
    }).save();
    
    //console.log("saved user",user);

    return res.json({ ok:true });
    
  }catch (err){ // codigo para manejar errores
    console.log(err);
    return res.status(400).send('ERROR. Try Again');
  }
};


export const login = async (req, res) => {
  try{
    //console.log(req.body);
    const {email,password} = req.body;

    //check if our db has uer with that email
    const user = await  User.findOne({email}).exec();
    if(!user) return res.status(400).send('Usuario no encontrado');
    // check password
    const match = await comparePassword(password, user.password);
    // create signed jwt
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
      expiresIn: "7d",
      
    });
    // return user and token to client, exclude hashed password
    user.password =undefined;
    // send token in cooke
    res.cookie("token",token,{
      httpOnly: true,
      //secure:true, // only works on https
    });
    // send user as json response 
    res.json(user);
  }catch(err){
    console.log(err);
    return res.status(400).send('ERROR. Try Again');
  
  }
};

export const logout = async ( req,res ) => {
try {
  res.clearCookie("token");
  return res.json ({message: "Ha cerrado sesión"}); 
} catch (err){
  console.log(err);
}
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").exec();
    console.log("CURRENT_USER", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const sendTestEmail= async (req,res) =>{
  console.log('send email using SES');
  res.json({ ok: true });

}
