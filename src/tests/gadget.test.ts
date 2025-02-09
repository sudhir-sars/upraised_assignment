import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let token: string;
let gadgetId: string;

// Before running gadget tests, register a user and retrieve a JWT token.
beforeAll(async () => {
  const res = await request(app)
    .post('/auth/register')
    .send({ userName: 'gadgetTester', password: 'password123' });

  token = res.body.token;
});

describe('Gadget Endpoints', () => {
  it('should create a new gadget', async () => {
    const res = await request(app)
      .post('/gadgets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Gadget' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    gadgetId = res.body.id;
  });

  it('should retrieve a list of gadgets with mission success probability', async () => {
    const res = await request(app)
      .get('/gadgets')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('missionSuccessProbability');
    }
  });

  it("should update a gadget's details", async () => {
    const res = await request(app)
      .patch(`/gadgets/${gadgetId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Gadget Name' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Gadget Name');
  });

  it('should decommission a gadget', async () => {
    const res = await request(app)
      .delete(`/gadgets/${gadgetId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Decommissioned');
    expect(res.body).toHaveProperty('decommissionedAt');
  });

  it('should initiate self-destruct sequence for a gadget', async () => {
    // Create a new gadget for self-destruct test
    const createRes = await request(app)
      .post(`/gadgets`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Self-Destruct Gadget' });

    const idForSelfDestruct = createRes.body.id;

    const res = await request(app)
      .patch(`/gadgets/${idForSelfDestruct}/self-destruct`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    // Check for a message and confirmation code in the response
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('confirmationCode');
  });
});

// Cleanup after all tests
afterAll(async () => {
  // Delete the user after all tests
  await prisma.user.deleteMany({
    where: { userName: 'gadgetTester' },
  });

  // Delete any gadgets created during the tests
  await prisma.gadget.deleteMany({
    where: { name: { in: ['Test Gadget', 'Self-Destruct Gadget'] } },
  });
});
