import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";

class SurveyController {
  /**
   * List all surveys from database
   *
   * @param request
   * @param response
   */
  async index(request: Request, response: Response) {
    const surveysRepository = getCustomRepository(SurveysRepository);

    const collection = await surveysRepository.find();

    return response.json(collection);
  }

  /**
   * Create a survey and save on database
   *
   * @param request
   * @param response
   */
  async create(request: Request, response: Response) {
    const { title, description } = request.body;

    const surveysRepository = getCustomRepository(SurveysRepository);

    const survey = surveysRepository.create({
      title, description
    });

    await surveysRepository.save(survey);

    return response.status(201).json(survey);
  }
}

export { SurveyController };