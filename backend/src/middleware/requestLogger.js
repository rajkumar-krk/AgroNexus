import mongoose from 'mongoose';

const apiLogSchema = new mongoose.Schema({
    method: String,
    url: String,
    statusCode: Number,
    responseTime: Number,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ip: String,
    userAgent: String,
    createdAt: { type: Date, default: Date.now, expires: 604800 }, // TTL 7 days
});

const ApiLog = mongoose.model('ApiLog', apiLogSchema);

const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        ApiLog.create({
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            responseTime: Date.now() - start,
            userId: req.user?._id,
            ip: req.ip,
            userAgent: req.get('user-agent'),
        }).catch(() => { });
    });
    next();
};

export default requestLogger;
