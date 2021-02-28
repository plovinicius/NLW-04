import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';
import { SurveyUsersRepository } from '../repositories/SurveyUsersRepository';

class AnswerCotroller {
  async execute(request: Request, response: Response) {
    const { value } = request.params;
    const { id } = request.query;

    const surveyUsersRepository = getCustomRepository(SurveyUsersRepository);

    const surveyUser = await surveyUsersRepository.findOne({
      id: String(id),
    });

    if (!surveyUser) {
      throw new AppError('Survey User does not exists!');
    }

    surveyUser.value = Number(value);

    await surveyUsersRepository.save(surveyUser);

    return response.json(surveyUser);
  }
}

export { AnswerCotroller };
