import User from "../models/user";

export const currentInstructor = async (req, res) => {
    try {
      let user = await User.findById(req.user._id).select("-password").exec();
      if (!user.role.includes("Instructor")) {
        return res.sendStatus(403);
      } else {
        res.json({ ok: true });
      }
    } catch (err) {
      console.log(err);
    }
};
  
  