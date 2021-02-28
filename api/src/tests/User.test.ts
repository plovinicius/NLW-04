import request from 'supertest';
import { app } from '../app';
import createConnection from '../database';

describe('Users', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  //#region Should be able to create a new user
  it('Should be able to create a new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'User Example',
      email: 'user@example.com',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });
  //#endregion

  //#region Should not be able to create a user with exists email
  it('Should not be able to create a user with exists email', async () => {
    const response = await request(app).post('/users').send({
      name: 'User Example',
      email: 'user@example.com',
    });

    expect(response.status).toBe(400);
  });
  //#endregion
});
