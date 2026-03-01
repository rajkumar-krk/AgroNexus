/**
 * Send a success JSON response.
 */
export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

/**
 * Send an error JSON response.
 */
export const errorResponse = (res, message = 'Something went wrong', statusCode = 400, errors = null) => {
    const response = {
        success: false,
        message,
    };
    if (errors) response.errors = errors;
    return res.status(statusCode).json(response);
};

/**
 * Send a paginated JSON response.
 */
export const paginatedResponse = (res, data, page, limit, total) => {
    return res.status(200).json({
        success: true,
        data,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / limit),
        },
    });
};
