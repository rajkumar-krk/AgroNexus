import axios from 'axios';

const cache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function getCached(key) {
    const item = cache.get(key);
    if (item && Date.now() - item.ts < CACHE_TTL) return item.data;
    cache.delete(key);
    return null;
}
function setCache(key, data) {
    cache.set(key, { data, ts: Date.now() });
}

const weatherCodes = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain', 71: 'Slight snow', 73: 'Moderate snow',
    75: 'Heavy snow', 80: 'Slight showers', 81: 'Moderate showers', 82: 'Violent showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Severe thunderstorm',
};

/** Get current weather for lat/lng */
export async function getCurrentWeather(lat, lng) {
    const key = `weather_current_${Number(lat).toFixed(3)}_${Number(lng).toFixed(3)}`;
    const cached = getCached(key);
    if (cached) return cached;

    const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: { latitude: lat, longitude: lng, current_weather: true, hourly: 'relativehumidity_2m,precipitation_probability', timezone: 'auto' },
    });
    const cw = data.current_weather;
    const result = {
        temperature: cw.temperature,
        windspeed: cw.windspeed,
        weathercode: cw.weathercode,
        humidity: data.hourly?.relativehumidity_2m?.[0] || null,
        description: weatherCodes[cw.weathercode] || 'Unknown',
    };
    setCache(key, result);
    return result;
}

/** Get 7-day forecast */
export async function getForecast(lat, lng, days = 7) {
    const key = `weather_forecast_${Number(lat).toFixed(3)}_${Number(lng).toFixed(3)}_${days}`;
    const cached = getCached(key);
    if (cached) return cached;

    const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
            latitude: lat, longitude: lng,
            daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,windspeed_10m_max,weathercode',
            timezone: 'auto', forecast_days: days,
        },
    });
    const d = data.daily;
    const result = d.time.map((date, i) => ({
        date,
        maxTemp: d.temperature_2m_max[i],
        minTemp: d.temperature_2m_min[i],
        rain: d.precipitation_sum[i],
        rainProbability: d.precipitation_probability_max[i],
        windspeed: d.windspeed_10m_max[i],
        weathercode: d.weathercode[i],
        description: weatherCodes[d.weathercode[i]] || 'Unknown',
    }));
    setCache(key, result);
    return result;
}

/** Compute smart alerts based on forecast */
export async function computeAlerts(lat, lng) {
    const forecast = await getForecast(lat, lng, 7);
    const alerts = [];
    let dryDays = 0;

    forecast.forEach((day) => {
        if (day.maxTemp > 40) alerts.push({ type: 'EXTREME_HEAT', severity: 'high', message: `Extreme heat (${day.maxTemp}°C) expected on ${day.date}. Irrigate early morning.`, date: day.date });
        if (day.minTemp < 4) alerts.push({ type: 'FROST_RISK', severity: 'high', message: `Frost risk (${day.minTemp}°C) on ${day.date}. Cover sensitive crops.`, date: day.date });
        if (day.rain > 50) alerts.push({ type: 'HEAVY_RAIN', severity: 'medium', message: `Heavy rain (${day.rain}mm) on ${day.date}. Avoid spraying. Check drainage.`, date: day.date });
        if (day.windspeed > 40) alerts.push({ type: 'HIGH_WIND', severity: 'medium', message: `Strong winds (${day.windspeed}km/h) on ${day.date}. Delay aerial spraying.`, date: day.date });

        if (day.rain < 1) { dryDays++; } else { dryDays = 0; }
        if (dryDays >= 5) alerts.push({ type: 'DROUGHT_RISK', severity: 'medium', message: `${dryDays} consecutive dry days detected. Plan irrigation.`, date: day.date });
    });

    return alerts;
}

/** Get spray windows for next 7 days */
export async function getSprayWindows(lat, lng) {
    const key = `spray_${Number(lat).toFixed(3)}_${Number(lng).toFixed(3)}`;
    const cached = getCached(key);
    if (cached) return cached;

    const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
            latitude: lat, longitude: lng,
            hourly: 'temperature_2m,relativehumidity_2m,windspeed_10m,precipitation',
            timezone: 'auto', forecast_days: 7,
        },
    });
    const h = data.hourly;
    const windows = [];
    for (let i = 0; i < h.time.length; i++) {
        const hour = new Date(h.time[i]).getHours();
        if (hour >= 12 && hour <= 15) continue; // skip midday
        const wind = h.windspeed_10m[i];
        const hum = h.relativehumidity_2m[i];
        const rain = h.precipitation[i];
        // Check 4h window for rain
        let rainIn4h = false;
        for (let j = i; j < Math.min(i + 4, h.time.length); j++) {
            if (h.precipitation[j] > 0) { rainIn4h = true; break; }
        }
        if (wind < 15 && !rainIn4h && hum < 75) {
            const date = h.time[i].split('T')[0];
            const quality = wind < 8 && hum < 60 ? 'ideal' : 'acceptable';
            windows.push({ date, startHour: hour, endHour: hour + 1, quality });
        }
    }
    // Group by date, take best windows per day
    const grouped = {};
    windows.forEach((w) => {
        if (!grouped[w.date]) grouped[w.date] = [];
        grouped[w.date].push(w);
    });
    const result = Object.entries(grouped).map(([date, ws]) => ({ date, windows: ws.slice(0, 4) }));
    setCache(key, result);
    return result;
}
