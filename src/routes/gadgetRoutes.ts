// src/routes/gadgetRoutes.ts
import { Router } from 'express';
import {
  createGadget,
  deleteGadget,
  getGadget,
  updateGadget
} from './handlers/gadgetHandler';

const router = Router();


router.post('/', createGadget);
router.get('/', getGadget);
router.delete('/:id', deleteGadget);
router.patch('/:id', updateGadget);
router.patch('/:id/self-destruct', updateGadget);


export default router;
