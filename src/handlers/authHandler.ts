// src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || 'default_secret';

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res
      .status(400)
      .json({ error: 'Username and password are required.' });
  }

  const existingUser = await prisma.user.findUnique({ where: { userName } });
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      userName,
      password: hashedPassword,
    },
  });

  // Issue JWT token (expires in 1 hour)
  const token = jwt.sign(
    { id: newUser.id, username: newUser.userName },
    jwtSecret,
    { expiresIn: '24h' }
  );

  res.status(201).json({ user: newUser, token });
};
