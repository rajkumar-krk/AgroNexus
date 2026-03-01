import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import connectDB from './src/config/database.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`🚀 FarmOS Backend running on http://localhost:${PORT}`);
        console.log(`📡 API endpoints: http://localhost:${PORT}/api/v1`);
        console.log(`🏥 Health check: http://localhost:${PORT}/api/v1/health`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
};

startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
