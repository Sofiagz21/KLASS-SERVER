import User from "../models/user";
import Course from "../models/course";


export const makeInstructor = async (req, res) => {
  try {
    // 1. Buscar el usuario en la base de datos
    const user = await User.findById(req.auth._id).exec();
    // 2. Cambiar el rol del usuario a "Instructor"
    user.role = ["Instructor"];
    await user.save();
    console.log(user);
    // 3. Enviar la respuesta al frontend
    res.status(200).send("¡El usuario ha sido configurado como instructor exitosamente!");
  } catch (err) {
    console.log("ERROR AL CONVERTIR EN INSTRUCTOR ", err);
    res.status(500).send("Ha ocurrido un error al convertir al usuario en instructor.");
  }
};

export const getAccountStatus = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id).exec();
    // Verificar el estado de la cuenta (puedes realizar lógica adicional aquí si es necesario)
    const chargesEnabled = false; // Cambiar esta variable según la lógica requerida

    if (!chargesEnabled) {
      return res.status(401).send("Unauthorized");
    } else {
      // Actualizar el rol del usuario a "Instructor"
      user.role = ["Instructor"];
      const statusUpdated = await user.save();

      res.json(statusUpdated);
    }
  } catch (err) {
    console.log(err);
  }
};

export const currentInstructor = async (req, res) => {
  try{
    let user = await User.findById(req.auth._id).select("-password").exec();
    if(!user.role.includes("Instructor")){
      return res.status(403);
    }else{
      res.json({ ok: true });
    }
  }catch(err){
    console.log(err);
  }
}

export const instructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({instructor: req.auth._id}) 
      .sort({ createdAt: -1})
      .exec();
    res.json(courses);
  } catch(err){
    console.log(err);
  }
}