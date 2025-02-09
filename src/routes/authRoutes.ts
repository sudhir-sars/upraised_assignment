// src/routes/authRoutes.ts
import { Router } from 'express';
import { registerUser } from '../handlers/authHandler';

const router = Router();

//Route for user registration.
router.post('/register', registerUser);

export default router;
