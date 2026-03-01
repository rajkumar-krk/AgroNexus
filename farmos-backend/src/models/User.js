import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: [true, 'Full name is required'], trim: true },
        email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
        phone: { type: String, trim: true, unique: true, sparse: true },
        passwordHash: { type: String, required: [true, 'Password is required'], select: false },
        role: { type: String, enum: ['farmer', 'buyer', 'admin'], default: 'farmer' },
        language: { type: String, default: 'en', enum: ['en', 'hi', 'te', 'ta', 'kn', 'mr'] },
        isVerified: { type: Boolean, default: false },
        phoneVerified: { type: Boolean, default: false },
        otp: { type: String, select: false },
        otpExpire: { type: Date, select: false },
        refreshTokens: { type: [String], select: false },
        profilePhoto: { type: String },
    },
    { timestamps: true }
);

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });

/**
 * Pre-save hook: hash password if modified.
 */
userSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) return next();
    this.passwordHash = await bcryptjs.hash(this.passwordHash, 12);
    next();
});

/**
 * Compare entered password with stored hash.
 * @param {string} enteredPassword
 * @returns {Promise<boolean>}
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcryptjs.compare(enteredPassword, this.passwordHash);
};

/**
 * Generate a short-lived JWT access token.
 * @returns {string}
 */
userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '15m',
    });
};

/**
 * Generate a long-lived JWT refresh token and push to refreshTokens array.
 * @returns {string}
 */
userSchema.methods.generateRefreshToken = function () {
    const token = jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
    });
    this.refreshTokens.push(token);
    return token;
};

/**
 * Generate a 6-digit OTP, hash it, and store it with 10-minute expiry.
 * @returns {Promise<string>} The plain OTP string (to send via SMS)
 */
userSchema.methods.generateOTP = async function () {
    const plainOTP = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp = await bcryptjs.hash(plainOTP, 10);
    this.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    return plainOTP;
};

/**
 * Match an entered OTP against the stored hash, checking expiry.
 * @param {string} enteredOTP
 * @returns {Promise<boolean>}
 */
userSchema.methods.matchOTP = async function (enteredOTP) {
    if (!this.otpExpire || this.otpExpire < Date.now()) return false;
    return bcryptjs.compare(enteredOTP, this.otp);
};

const User = mongoose.model('User', userSchema);
export default User;
