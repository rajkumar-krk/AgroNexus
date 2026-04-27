import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import connectDB from './src/config/database.js';
import logger from './src/utils/logger.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        logger.info(`🚀 AgroNexus Backend running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
        if (process.env.NODE_ENV === 'development') {
            logger.info(`📡 API: http://localhost:${PORT}/api/v1`);
            logger.info(`🏥 Health: http://localhost:${PORT}/api/v1/health`);
        }
    });
};

startServer().catch((err) => {
    logger.error('Failed to start server:', err.message);
    process.exit(1);
});
