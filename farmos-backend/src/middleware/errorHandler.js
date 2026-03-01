import { errorResponse } from '../utils/apiResponse.js';

/**
 * Global error handler middleware.
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.stack);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        return errorResponse(res, 'Resource not found', 404);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return errorResponse(res, 'Validation error', 400, messages);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue).join(', ');
        return errorResponse(res, `Duplicate value for: ${field}`, 400);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return errorResponse(res, 'Invalid token', 401);
    }
    if (err.name === 'TokenExpiredError') {
        return errorResponse(res, 'Token expired', 401);
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export default errorHandler;
