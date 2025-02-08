// src/routes/gadgetRoutes.ts
import { Router } from 'express';
import {
  createGadget,
  getGadget,
} from './handlers/gadgetHandler';

const router = Router();


router.post('/', createGadget);
router.get('/', getGadget);


export default router;
