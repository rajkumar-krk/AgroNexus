import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import {
    register, login, googleAuth, getMe, logout,
} from '../controllers/authController.js';

const router = Router();

const registerValidation = [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate,
];

const loginValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/google', googleAuth);
router.get('/me/:userId', getMe);
router.post('/logout', logout);

export default router;
