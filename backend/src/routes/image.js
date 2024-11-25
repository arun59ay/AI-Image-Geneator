import express from 'express';
import { auth } from '../middleware/auth.js';
import { generateImage, getUserImages } from '../controllers/image.js';

const router = express.Router();

router.post('/generate', auth, generateImage);
router.get('/user', auth, getUserImages);

export default router;