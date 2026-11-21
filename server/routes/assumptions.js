import { Router } from 'express';
import assumptionController from '../controllers/assumptionController.js';

const router = Router();

router.get('/', assumptionController.getAssumptions);
router.get('/:wasteType', assumptionController.getAssumptionByWasteType);

export default router;
