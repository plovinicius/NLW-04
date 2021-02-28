import { Request, Response } from 'express';
import { getCustomRepository, IsNull, Not } from 'typeorm';
import { SurveyUsersRepository } from '../repositories/SurveyUsersRepository';

class NpsController {
  /**
   * Como funciona o calculode NPS
   * 1 2 3 4 5 6 7 8 9 10
   * Detratores: 0 - 6
   * Passivos: 7 - 8
   * Promotores: 9 - 10
   *
   * (num promotores - num detratores) / (num respostas) * 100
   */
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const surveyUsersRepository = getCustomRepository(SurveyUsersRepository);

    const surveyUsers = await surveyUsersRepository.find({
      survey_id,
      value: Not(IsNull()),
    });

    const detractorsCount = surveyUsers.filter((row) => row.value >= 0 && row.value <= 6).length;
    const promotersCount = surveyUsers.filter((row) => row.value >= 9 && row.value <= 10).length;
    const passivesCount = surveyUsers.filter((row) => row.value >= 7 && row.value <= 8).length;
    const answersCount = surveyUsers.length;

    const calculate = Number((((promotersCount - detractorsCount) / answersCount) * 100).toFixed(2));

    return response.json({
      detractors: detractorsCount,
      promoters: promotersCount,
      passives: passivesCount,
      answers: answersCount,
      nps: calculate,
    });
  }
}

export { NpsController };
