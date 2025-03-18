import express from 'express';
import { signup, signin, getUserDetails } from '../controllers/usercontroller.js';
import { verifyToken } from '../controllers/authcontroller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);

router.get('/details', verifyToken, getUserDetails);

export default router;