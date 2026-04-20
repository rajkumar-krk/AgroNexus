import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Protect routes — verify JWT access token and attach user to req.
 */
export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return errorResponse(res, 'Not authorized — no token', 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return errorResponse(res, 'User not found', 401);
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return errorResponse(res, 'Invalid token', 401);
        }
        if (error.name === 'TokenExpiredError') {
            return errorResponse(res, 'Token expired', 401);
        }
        return errorResponse(res, 'Not authorized', 401);
    }
};

/**
 * Authorize by role — restrict route to specified roles.
 * @param {...string} roles
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return errorResponse(res, 'Access denied: insufficient permissions', 403);
        }
        next();
    };
};
