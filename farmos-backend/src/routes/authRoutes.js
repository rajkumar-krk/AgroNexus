import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import {
    register, verifyPhone, resendOTP, login, refreshToken, logout, getMe, forgotPassword, resetPassword,
} from '../controllers/authController.js';

const router = Router();

const registerValidation = [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('role').optional().isIn(['farmer', 'buyer']).withMessage('Role must be farmer or buyer'),
    validate,
];

const verifyPhoneValidation = [
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    validate,
];

const loginValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
];

const resetPasswordValidation = [
    body('phone').notEmpty().withMessage('Phone is required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    validate,
];

router.post('/register', registerValidation, register);
router.post('/verify-phone', verifyPhoneValidation, verifyPhone);
router.post('/resend-otp', body('phone').notEmpty(), validate, resendOTP);
router.post('/login', loginValidation, login);
router.post('/refresh', body('refreshToken').notEmpty(), validate, refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', body('phone').notEmpty(), validate, forgotPassword);
router.post('/reset-password', resetPasswordValidation, resetPassword);

export default router;
