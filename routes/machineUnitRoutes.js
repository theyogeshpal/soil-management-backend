import express from 'express';
import { getMachineUnits, createMachineUnit, getAvailableUnits, getUnitsBySite, getUnitsByIncharge, updateMachineUnit, deleteMachineUnit, purchaseMachineUnit } from '../controllers/machineUnitController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import { upload } from '../config/multer.js';

const router = express.Router();

router.use(authMiddleware);

router
    .route('/')
    .get(getMachineUnits)
    .post(roleMiddleware('superadmin', 'admin'), upload.single('amcDocument'), createMachineUnit);

router.post('/purchase', purchaseMachineUnit);
router.get('/available', getAvailableUnits);
router.get('/site/:siteId', getUnitsBySite);
router.get('/incharge/:userId', getUnitsByIncharge);

router
    .route('/:id')
    .put(roleMiddleware('superadmin', 'admin'), upload.single('amcDocument'), updateMachineUnit)
    .delete(roleMiddleware('superadmin', 'admin'), deleteMachineUnit);

export default router;
