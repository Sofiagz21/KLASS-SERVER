import express from "express";
import formidable from "express-formidable"

const router = express.Router();

// middleware
import { requireSignin, isInstructor } from "../middlewares";

// controllers
import { uploadImage, 
        removeImage, 
        create,
        read,
        uploadPdf,
        removePdf
        } from "../controllers/course";


// image
router.post("/course/upload-image", uploadImage);
router.post("/course/remove-image", removeImage);
// course
router.post("/course", requireSignin, isInstructor, create);
router.get("/course/:slug",read);
router.post('/course/pdf-upload',requireSignin, formidable(), uploadPdf)
router.post('/course/pdf-remove',requireSignin, removePdf)


module.exports = router;

