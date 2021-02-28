import { Router } from 'express';
import { UserController } from './controllers/UserController';
import { SurveyController } from './controllers/SurveyController';
import { SendMailController } from './controllers/SendMailController';

const router = Router();
const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailController();

// Users
router.post('/users', userController.create);

// Surveys
router.get('/surveys', surveyController.index);
router.post('/surveys', surveyController.create);

// Survey Users
router.post('/sendmail', sendMailController.execute);

export { router };
