import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: [true, 'Full name is required'], trim: true },
        email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
        phone: { type: String, trim: true, sparse: true },
        passwordHash: { type: String, select: false },
        googleId: { type: String, sparse: true },
        profilePhoto: { type: String },
        role: { type: String, enum: ['farmer', 'buyer', 'admin'], default: 'farmer' },
        language: { type: String, default: 'en', enum: ['en', 'hi', 'te', 'ta', 'kn', 'mr'] },
        isVerified: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Indexes are created implicitly by unique:true and sparse:true in schema definition

/**
 * Pre-save hook: hash password if modified.
 */
userSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash') || !this.passwordHash) return next();
    this.passwordHash = await bcryptjs.hash(this.passwordHash, 12);
    next();
});

/**
 * Compare entered password with stored hash.
 * @param {string} enteredPassword
 * @returns {Promise<boolean>}
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.passwordHash) return false;
    return bcryptjs.compare(enteredPassword, this.passwordHash);
};

const User = mongoose.model('User', userSchema);
export default User;
