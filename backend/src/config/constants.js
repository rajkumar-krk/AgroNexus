export const ROLES = {
    FARMER: 'farmer',
    BUYER: 'buyer',
    ADMIN: 'admin',
};

export const LANGUAGES = ['en', 'hi', 'te', 'ta', 'kn', 'mr'];

export const SOIL_TYPES = ['clay', 'loamy', 'sandy', 'silt', 'black', 'red', 'alluvial'];

export const IRRIGATION_TYPES = ['drip', 'sprinkler', 'flood', 'rainfed'];

export const SEASONS = ['kharif', 'rabi', 'zaid'];

export const CROP_STATUSES = ['growing', 'harvested', 'failed', 'sold'];

export const ORDER_STATUSES = ['pending', 'confirmed', 'packed', 'in_transit', 'delivered', 'cancelled', 'disputed'];

export const LISTING_STATUSES = ['active', 'sold', 'expired', 'cancelled'];

export const NOTIFICATION_TYPES = ['pest_alert', 'weather_alert', 'order_update', 'price_alert'];

export const PEST_SEVERITIES = ['spotted', 'moderate', 'severe', 'devastating'];

export const DISEASE_SEVERITIES = ['low', 'medium', 'high', 'critical'];

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
};
