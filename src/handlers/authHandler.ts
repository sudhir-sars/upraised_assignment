// src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || 'default_secret';

//Registers a new user.

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userName, password } = req.body;

  try {
    // Check if both userName and password are provided
    if (!userName || !password) {
      res.status(400).json({ error: 'Username and password are required.' });
      return;
    }

    // Check if a user with the given userName already exists in the database
    const existingUser = await prisma.user.findUnique({ where: { userName } });
    if (existingUser) {
      res.status(409).json({ error: 'User already exists.' });
      return;
    }

    // Hash the provided password using bcrypt with a salt rounds value of 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database
    const newUser = await prisma.user.create({
      data: {
        userName,
        password: hashedPassword,
      },
    });

    // Issue a JWT token that expires in 24 hours, including the user's id and userName in the payload
    const token = jwt.sign(
      { id: newUser.id, username: newUser.userName },
      jwtSecret,
      { expiresIn: '24h' }
    );

    // Respond with the new user data and the generated JWT token
    res.status(201).json({ user: newUser, token });
    next();
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
