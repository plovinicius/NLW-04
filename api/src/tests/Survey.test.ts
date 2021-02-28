import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';
import createConnection from '../database';

describe('Surveys', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  //#region  Should be able to create a new survey
  it('Should be able to create a new survey', async () => {
    const response = await request(app).post('/surveys').send({
      title: 'Survey Example',
      description: 'Survey description example',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
  //#endregion

  //#region Should be able to get all surveys
  it('Should be able to get all surveys', async () => {
    await request(app).post('/surveys').send({
      title: 'Survey Example',
      description: 'Survey description example',
    });

    const response = await request(app).get('/surveys');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });
  //#endregion
});
