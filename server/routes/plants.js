import { Router } from 'express';
import plantController from '../controllers/plantController.js';

const router = Router();

router.get('/', plantController.getPlants);
router.get('/compare', plantController.comparePlantsEndpoint);
router.post('/compare', plantController.comparePlantsEndpoint);
router.get('/:id', plantController.getPlantById);
router.put('/:id', plantController.updatePlantEndpoint);

export default router;
