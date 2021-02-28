import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { resolve } from 'path';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveyUsersRepository } from '../repositories/SurveyUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import SendMailService from '../services/SendMailService';
import { AppError } from '../errors/AppError';

class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveyUsersRepository = getCustomRepository(SurveyUsersRepository);

    const userExists = await usersRepository.findOne({ email });

    if (!userExists) {
      throw new AppError('User does not exists!');
    }

    const surveyExists = await surveysRepository.findOne({ id: survey_id });

    if (!surveyExists) {
      throw new AppError('Survey does not exists!');
    }

    // retorna path do arquivo (html/hbs) template do email
    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'nps.hbs');

    const surveyUserExists = await surveyUsersRepository.findOne({
      where: { user_id: userExists.id, survey_id, value: null },
      relations: ['user', 'survey'],
    });

    // atributos para serem utilizados dentro do template de email (html/hbs)
    const attributes = {
      name: userExists.name,
      title: surveyExists.title,
      description: surveyExists.description,
      link: process.env.URL_MAIL,
      id: "",
    };

    if (surveyUserExists) {
      attributes.id = surveyUserExists.id;
      await SendMailService.execute(email, surveyExists.title, attributes, npsPath);
      return response.json(surveyUserExists);
    }

    const surveyUser = surveyUsersRepository.create({
      user_id: userExists.id,
      survey_id,
    });

    await surveyUsersRepository.save(surveyUser);

    attributes.id = surveyUser.id;

    await SendMailService.execute(email, surveyExists.title, attributes, npsPath);

    response.status(201).send(surveyUser);
  }
}

export { SendMailController };
