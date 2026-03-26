import express from 'express';
import { getMovements, requestMovement, approveMovement, completeMovement } from '../controllers/machineMovementController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router
  .route('/')
  .get(getMovements)
  .post(requestMovement);

router.put('/:id/approve', approveMovement);
router.put('/:id/complete', completeMovement);

export default router;
