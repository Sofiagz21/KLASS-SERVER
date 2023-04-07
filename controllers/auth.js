import User from "../models/user";
import { hashPassword} from "../utils/auth";

export const register = async (req, res) => {
  try{ // codigo que puede manejar errores
    //console.log(req.body);
    const {name,secondName,lastName,secondLastName,email,password}= req.body; 
    //validation
    
    if(!name)     return res.status(400).send("Tu nombre es requerido");
    if(!lastName) return res.status(400).send("Tu apellido es requerido");
    if(!password || password.length <6){
      return res.status(400).send('La contraseña es requerida y debe tener al menos 6 caracteres');
    } 
    let userExist = await User.findOne({email}).exec();
    if(userExist)   return res.status(400).send("Ya existe este correo electronico");
    
    // hash password
    const hashedPassword = await hashPassword(password);
    
    //register
    const user = new User({
      name,
      secondName,
      lastName,
      secondLastName,
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





