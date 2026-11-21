import { Router } from 'express';
import enquiryController from '../controllers/enquiryController.js';

const router = Router();

router.get('/', enquiryController.getEnquiries);
router.get('/:id', enquiryController.getEnquiryById);
router.post('/', enquiryController.createEnquiry);
router.post('/:id/reply', enquiryController.replyToEnquiry);
router.patch('/:id/status', enquiryController.updateStatus);

export default router;
