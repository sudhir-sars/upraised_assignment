import { describe, it, expect, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Authentication Endpoints', () => {
  describe('POST /auth/register', () => {
    it('should register a new user and return a token', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ userName: 'test_user007', password: 'password123' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('user');
      expect(res.body).toHaveProperty('token');
    });

    it('should return 400 if username and/or password are missing', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ userName: '', password: '' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 409 if the user already exists', async () => {
      // First registration
      await request(app)
        .post('/auth/register')
        .send({ userName: 'duplicateUser', password: 'password123' });

      // Second registration with the same username
      const res = await request(app)
        .post('/auth/register')
        .send({ userName: 'duplicateUser', password: 'password123' });

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Cleanup user after tests are done
  afterAll(async () => {
    // Delete the user after all tests
    await prisma.user.deleteMany({
      where: { userName: 'test_user007' },
    });
  });
});
