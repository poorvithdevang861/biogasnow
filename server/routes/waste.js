import { Router } from 'express';
import wasteController from '../controllers/wasteController.js';

const router = Router();

router.get('/', wasteController.getWasteProfiles);
router.post('/assess', wasteController.assessWasteStream);
router.post('/match', wasteController.matchPlantsForWaste);
router.get('/:profileId', wasteController.getWasteProfile);
router.post('/', wasteController.saveWasteProfile);

export default router;
