import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['pest_alert', 'weather_alert', 'order_update', 'price_alert', 'group_order', 'general'] },
    title: String,
    message: String,
    relatedId: mongoose.Schema.Types.ObjectId,
    relatedModel: String,
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

notificationSchema.index({ recipient: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
