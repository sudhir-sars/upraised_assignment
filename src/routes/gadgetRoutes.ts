// src/routes/gadgetRoutes.ts
import { Router } from 'express';
import {
  createGadget,
  deleteGadget,
  getGadget,
  updateGadget,
} from '../handlers/gadgetHandler';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

// Apply authentication middleware to all gadget routes
router.use(authenticateJWT);

router.post('/', createGadget);
router.get('/', getGadget);
router.delete('/:id', deleteGadget);
router.patch('/:id', updateGadget);
router.patch('/:id/self-destruct', updateGadget);

export default router;
