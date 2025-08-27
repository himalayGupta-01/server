import express from "express";
import AuthController from "../controllers/AuthController.js";
import auth from './../middlewares/auth.js';
import ServiceController from "../controllers/ServiceController.js";
const router=express.Router();

router.get("/getStudent",auth, ServiceController.getStudentProfile);
router.get("/getProgressStats",auth, ServiceController.getProgressStats);
router.get("/getProgress", auth, ServiceController.getProgress);
router.post("/updateProgress", auth, ServiceController.updateProgress)
router.post("/addProblem", ServiceController.addProblem);

router.post("/register",AuthController.addStudent);
router.post("/login",AuthController.getStudentByEmail);
router.post("/logout",AuthController.logout);

export default router;