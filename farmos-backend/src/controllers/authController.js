import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOTPSMS, sendPasswordResetSMS } from '../services/twilioService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/** 1. Register a new user */
export const register = async (req, res) => {
    try {
        const { fullName, email, phone, password, role, language } = req.body;

        const existingEmail = await User.findOne({ email });
        if (existingEmail) return errorResponse(res, 'Email already registered', 400);

        if (phone) {
            const existingPhone = await User.findOne({ phone });
            if (existingPhone) return errorResponse(res, 'Phone number already registered', 400);
        }

        const user = new User({ fullName, email, phone, passwordHash: password, role, language });
        const plainOTP = await user.generateOTP();
        await user.save();

        if (phone) await sendOTPSMS(phone, plainOTP);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        await user.save();

        return successResponse(
            res,
            {
                accessToken,
                refreshToken,
                user: { _id: user._id, fullName: user.fullName, email: user.email, phone: user.phone, role: user.role, language: user.language, isVerified: user.isVerified, phoneVerified: user.phoneVerified },
            },
            'Registration successful. OTP sent to your phone number.',
            201
        );
    } catch (error) {
        console.error('Register error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/** 2. Verify phone OTP */
export const verifyPhone = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const user = await User.findOne({ phone }).select('+otp +otpExpire');
        if (!user) return errorResponse(res, 'No account found with this phone number', 404);
        if (user.phoneVerified) return errorResponse(res, 'Phone number already verified', 400);

        const isMatch = await user.matchOTP(otp);
        if (!isMatch) return errorResponse(res, 'Invalid or expired OTP. Please request a new one.', 400);

        user.phoneVerified = true;
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save();

        return successResponse(res, null, 'Phone verified successfully. You can now log in.');
    } catch (error) {
        console.error('VerifyPhone error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/** 3. Resend OTP */
export const resendOTP = async (req, res) => {
    try {
        const { phone } = req.body;
        const user = await User.findOne({ phone }).select('+otp +otpExpire');
        if (!user) return errorResponse(res, 'No account found with this phone number', 404);
        if (user.phoneVerified) return errorResponse(res, 'Phone already verified', 400);

        const plainOTP = await user.generateOTP();
        await user.save();
        await sendOTPSMS(phone, plainOTP);

        return successResponse(res, null, 'OTP resent to your phone number');
    } catch (error) {
        console.error('ResendOTP error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/** 4. Login */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+passwordHash +refreshTokens +otp +otpExpire');
        if (!user) return errorResponse(res, 'Invalid email or password', 401);

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return errorResponse(res, 'Invalid email or password', 401);

        if (!user.phoneVerified && user.phone) {
            const plainOTP = await user.generateOTP();
            await user.save();
            await sendOTPSMS(user.phone, plainOTP);
            return errorResponse(res, 'Phone not verified. A new OTP has been sent to your phone.', 403);
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        await user.save();

        return successResponse(res, {
            accessToken,
            refreshToken,
            user: { _id: user._id, fullName: user.fullName, email: user.email, phone: user.phone, role: user.role, language: user.language, isVerified: user.isVerified, phoneVerified: user.phoneVerified },
        });
    } catch (error) {
        console.error('Login error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/** 5. Refresh token */
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken: token } = req.body;
        if (!token) return errorResponse(res, 'Refresh token required', 400);

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch {
            return errorResponse(res, 'Invalid refresh token', 401);
        }

        const user = await User.findById(decoded.id).select('+refreshTokens');
        if (!user) return errorResponse(res, 'User not found', 401);
        if (!user.refreshTokens.includes(token)) return errorResponse(res, 'Invalid refresh token', 401);

        user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
        const newAccessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();
        await user.save();

        return successResponse(res, { accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        console.error('RefreshToken error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/** 6. Logout */
export const logout = async (req, res) => {
    try {
        const { refreshToken: token } = req.body;
        const user = await User.findById(req.user._id).select('+refreshTokens');
        if (user && token) {
            user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
            await user.save();
        }
        return successResponse(res, null, 'Logged out successfully');
    } catch (error) {
        console.error('Logout error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/** 7. Get current user */
export const getMe = async (req, res) => {
    try {
        return successResponse(res, req.user);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

/** 8. Forgot password — send OTP via SMS */
export const forgotPassword = async (req, res) => {
    try {
        const { phone } = req.body;
        const user = await User.findOne({ phone }).select('+otp +otpExpire');
        if (!user) return errorResponse(res, 'No account found with this phone number', 404);

        const plainOTP = await user.generateOTP();
        await user.save();
        await sendPasswordResetSMS(phone, plainOTP);

        return successResponse(res, null, 'Password reset OTP sent to your phone number');
    } catch (error) {
        console.error('ForgotPassword error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/** 9. Reset password with OTP */
export const resetPassword = async (req, res) => {
    try {
        const { phone, otp, newPassword } = req.body;
        const user = await User.findOne({ phone }).select('+otp +otpExpire +passwordHash +refreshTokens');
        if (!user) return errorResponse(res, 'No account found with this phone number', 404);

        const isMatch = await user.matchOTP(otp);
        if (!isMatch) return errorResponse(res, 'Invalid or expired OTP', 400);

        user.passwordHash = newPassword;
        user.otp = undefined;
        user.otpExpire = undefined;
        user.refreshTokens = [];
        await user.save();

        return successResponse(res, null, 'Password reset successful. Please log in with your new password.');
    } catch (error) {
        console.error('ResetPassword error:', error);
        return errorResponse(res, error.message, 500);
    }
};
