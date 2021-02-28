import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';

class UserController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required('Nome é obrigatório'),
      email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
    });

    try {
      await schema.validate(request.body);
    } catch (err) {
      throw new AppError(err);
    }

    // outra forma de validar
    // if (!(await schema.isValid(request.body))) {
    //   throw new AppError('Validation Failed!');
    // }

    const userRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await userRepository.findOne({
      email,
    });

    if (userAlreadyExists) {
      return response.status(400).json({
        error: 'Usuário já existe!',
      });
    }

    const user = userRepository.create({
      name,
      email,
    });

    await userRepository.save(user);

    return response.status(201).json(user);
  }
}

export { UserController };
