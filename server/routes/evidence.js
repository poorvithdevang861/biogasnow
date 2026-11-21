import { Router } from 'express';
import evidenceController from '../controllers/evidenceController.js';

const router = Router();

router.get('/', evidenceController.getEvidence);
router.post('/', evidenceController.addEvidence);
router.delete('/:id', evidenceController.deleteEvidence);

export default router;
