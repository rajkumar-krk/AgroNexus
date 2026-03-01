import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Express-validator wrapper middleware.
 * Checks validation result and returns 400 with errors if any.
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const messages = errors.array().map((e) => e.msg);
        return errorResponse(res, messages[0], 400, messages);
    }
    next();
};

export default validate;
