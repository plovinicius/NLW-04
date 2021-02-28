import { Router } from 'express';
import { UserController } from './controllers/UserController';
import { SurveyController } from './controllers/SurveyController';
import { SendMailController } from './controllers/SendMailController';
import { AnswerCotroller } from './controllers/AnswerController';
import { NpsController } from './controllers/NpsController';

const router = Router();
const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailController();
const answerController = new AnswerCotroller();
const npsController = new NpsController();

// Users
router.post('/users', userController.create);

// Surveys
router.get('/surveys', surveyController.index);
router.post('/surveys', surveyController.create);

// Survey Users
router.post('/sendmail', sendMailController.execute);

// Answers
router.get('/answers/:value', answerController.execute);

// NPS
router.get('/nps/:survey_id', npsController.execute);

export { router };
