// src/routes/gadgetRoutes.ts
import { Router } from 'express';
import {
  createGadget,
  deleteGadget,
  getGadget,
} from './handlers/gadgetHandler';

const router = Router();


router.post('/', createGadget);
router.get('/', getGadget);
router.delete('/:id', deleteGadget);


export default router;
