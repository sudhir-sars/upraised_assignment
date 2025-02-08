// src/routes/gadgetRoutes.ts
import { Router } from 'express';
import {
  createGadget,
} from './handlers/gadgetHandler';

const router = Router();


router.post('/', createGadget);


export default router;
