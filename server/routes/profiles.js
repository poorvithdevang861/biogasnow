import { Router } from 'express';
import profileController from '../controllers/profileController.js';

const router = Router();

router.get('/', profileController.getProfiles);
router.get('/me', profileController.getCurrentProfile);
router.get('/:id', profileController.getProfileById);

export default router;
