import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/** 1. Register a new user */
export const register = async (req, res) => {
    try {
        const { fullName, email, password, phone, role, language } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return errorResponse(res, 'Email already registered', 400);

        const user = new User({
            fullName,
            email,
            phone,
            passwordHash: password,
            role,
            language,
        });
        await user.save();

        return successResponse(
            res,
            {
                user: {
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    language: user.language,
                    profilePhoto: user.profilePhoto,
                },
            },
            'Registration successful.',
            201
        );
    } catch (error) {
        console.error('Register error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/** 2. Login with email/password */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+passwordHash');
        if (!user) return errorResponse(res, 'Invalid email or password', 401);

        if (!user.passwordHash) {
            return errorResponse(res, 'This account uses Google Sign-In. Please log in with Google.', 401);
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return errorResponse(res, 'Invalid email or password', 401);

        return successResponse(res, {
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                language: user.language,
                profilePhoto: user.profilePhoto,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/** 3. Google Sign-In / Sign-Up */
export const googleAuth = async (req, res) => {
    try {
        const { googleId, email, fullName, profilePhoto } = req.body;

        if (!googleId || !email) {
            return errorResponse(res, 'Google ID and email are required', 400);
        }

        // Check if user exists with this Google ID or email
        let user = await User.findOne({ $or: [{ googleId }, { email }] });

        if (user) {
            // Update Google ID if missing (user registered with email first, now linking Google)
            if (!user.googleId) {
                user.googleId = googleId;
                if (profilePhoto) user.profilePhoto = profilePhoto;
                await user.save();
            }
        } else {
            // Create new user
            user = new User({
                fullName,
                email,
                googleId,
                profilePhoto,
                isVerified: true,
            });
            await user.save();
        }

        return successResponse(res, {
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                language: user.language,
                profilePhoto: user.profilePhoto,
            },
        });
    } catch (error) {
        console.error('Google Auth error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/** 4. Get current user by ID */
export const getMe = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) return errorResponse(res, 'User not found', 404);
        return successResponse(res, user);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

/** 5. Logout (no-op on server, frontend clears localStorage) */
export const logout = async (req, res) => {
    return successResponse(res, null, 'Logged out successfully');
};
