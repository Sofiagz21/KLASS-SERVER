import express from "express";
import formidable from "express-formidable"

const router = express.Router();

// middleware
import { requireSignin, isInstructor } from "../middlewares";

// controllers
import { 
        uploadImage, 
        removeImage, 
        create,
        read,
        uploadPdf,
        removePdf, 
        addLesson,
        updateLesson,
        update,
        removeLesson
        } from "../controllers/course";


// image
router.post("/course/upload-image", uploadImage);

router.post("/course/remove-image", removeImage);
// course
router.post("/course", requireSignin, isInstructor, create);

router.put("/course/:slug", requireSignin, update);

router.get("/course/:slug",read);

router.post('/course/pdf-upload/:instructorId',

requireSignin,
 formidable(), 
 uploadPdf)
router.post('/course/pdf-remove/:instructorId',
requireSignin,
removePdf);
//`/api/course/lesson/${slug}/${course.instructor._id}`

router.post('/course/lesson/:slug/:instructorId', requireSignin,addLesson);

router.post('/course/lesson/:slug/:instructorId', requireSignin,updateLesson);

router.put('/course/:slug/:lessonId', requireSignin, removeLesson )


module.exports = router;

