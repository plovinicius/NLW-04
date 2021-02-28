import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { SurveyController } from "./controllers/SurveyController";

const router = Router();
const userController = new UserController();
const surveyController = new SurveyController();

// Users
router.post("/users", userController.create);

// Surveys
router.get("/surveys", surveyController.index);
router.post("/surveys", surveyController.create);

export { router };