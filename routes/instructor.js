import express from "express";

const router = express.Router();

// middleware
import { requireSignin } from "../middlewares";

// controllers
import {
    currentInstructor
         
} from "../controllers/instructor";


router.get('current-instructor', requireSignin, currentInstructor);


module.exports = router;