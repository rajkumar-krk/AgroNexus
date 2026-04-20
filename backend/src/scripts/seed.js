import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

// Models
import User from '../models/User.js';
import Farm from '../models/Farm.js';
import Crop from '../models/Crop.js';
import Listing from '../models/Listing.js';
import Order from '../models/Order.js';
import GroupOrder from '../models/GroupOrder.js';
import PestAlert from '../models/PestAlert.js';
import MarketPrice from '../models/MarketPrice.js';
import Notification from '../models/Notification.js';

// Seed helpers
import { runSeed as seedDiseases } from './seedDiseases.js';
import { runSeed as seedAdvisories } from './seedAdvisories.js';

const shouldReset = process.argv.includes('--reset');

async function seed() {
    console.log('\n🌱 FarmOS Master Seed Script');
    console.log('============================\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    if (shouldReset) {
        console.log('🗑  Resetting all collections...');
        const collections = ['users', 'farms', 'crops', 'listings', 'orders', 'grouporders', 'pestalerts', 'marketprices', 'notifications', 'diseases', 'advisories', 'diseasereports', 'weatherlogs', 'pricelocks'];
        for (const c of collections) {
            try { await mongoose.connection.db.dropCollection(c); } catch { }
        }
        console.log('   Done.\n');
    }

    // ── STEP 1: Users ──
    console.log('👤 Step 1: Seeding Users...');
    const usersData = [
        { fullName: 'FarmOS Admin', email: 'admin@farmos.in', phone: '+919999900000', passwordHash: 'Admin@123', role: 'admin', isVerified: true, phoneVerified: true },
        { fullName: 'Raju Naidu', email: 'farmer1@test.in', phone: '+919999900001', passwordHash: 'Test@123', role: 'farmer', language: 'te', isVerified: true, phoneVerified: true },
        { fullName: 'Priya Sharma', email: 'farmer2@test.in', phone: '+919999900002', passwordHash: 'Test@123', role: 'farmer', language: 'hi', isVerified: true, phoneVerified: true },
        { fullName: 'Mohammed Ismail', email: 'farmer3@test.in', phone: '+919999900003', passwordHash: 'Test@123', role: 'farmer', language: 'mr', isVerified: true, phoneVerified: true },
        { fullName: 'Agro Traders Pvt Ltd', email: 'buyer1@test.in', phone: '+919999900004', passwordHash: 'Test@123', role: 'buyer', isVerified: true, phoneVerified: true },
        { fullName: 'FreshMart Hyderabad', email: 'buyer2@test.in', phone: '+919999900005', passwordHash: 'Test@123', role: 'buyer', isVerified: true, phoneVerified: true },
        { fullName: 'Organic India Foods', email: 'buyer3@test.in', phone: '+919999900006', passwordHash: 'Test@123', role: 'buyer', isVerified: true, phoneVerified: true },
        { fullName: 'Dr. Ramesh Agronomist', email: 'expert@farmos.in', phone: '+919999900007', passwordHash: 'Expert@123', role: 'admin', isVerified: true, phoneVerified: true },
    ];

    const users = {};
    for (const ud of usersData) {
        let user = await User.findOne({ email: ud.email });
        if (!user) { user = await User.create(ud); }
        users[ud.email] = user;
    }
    console.log(`   Created ${Object.keys(users).length} users`);

    const raju = users['farmer1@test.in'];
    const priya = users['farmer2@test.in'];
    const mohammed = users['farmer3@test.in'];
    const buyer1 = users['buyer1@test.in'];
    const buyer2 = users['buyer2@test.in'];
    const buyer3 = users['buyer3@test.in'];

    // ── STEP 2: Farms ──
    console.log('🌾 Step 2: Seeding Farms...');
    const farmsData = [
        { owner: raju._id, name: 'Naidu Rice Farm', location: { lat: 17.98, lng: 79.59, village: 'Palakurthi', district: 'Warangal', state: 'Telangana', pincode: '506002' }, areaHectares: 5, soilType: 'alluvial', irrigationType: 'flood' },
        { owner: raju._id, name: 'Naidu Cotton Field', location: { lat: 18.02, lng: 79.63, village: 'Narsampet', district: 'Warangal', state: 'Telangana', pincode: '506132' }, areaHectares: 3, soilType: 'black', irrigationType: 'drip' },
        { owner: priya._id, name: 'Sharma Wheat Plot', location: { lat: 21.14, lng: 79.08, village: 'Umred', district: 'Nagpur', state: 'Maharashtra', pincode: '441204' }, areaHectares: 4, soilType: 'black', irrigationType: 'sprinkler' },
        { owner: priya._id, name: 'Sharma Vegetable Garden', location: { lat: 21.16, lng: 79.10, village: 'Umred', district: 'Nagpur', state: 'Maharashtra', pincode: '441204' }, areaHectares: 1.5, soilType: 'loamy', irrigationType: 'drip' },
        { owner: mohammed._id, name: 'Ismail Onion Farm', location: { lat: 20.01, lng: 73.77, village: 'Dindori', district: 'Nashik', state: 'Maharashtra', pincode: '422202' }, areaHectares: 6, soilType: 'red', irrigationType: 'sprinkler' },
        { owner: mohammed._id, name: 'Ismail Grape Farm', location: { lat: 20.03, lng: 73.79, village: 'Dindori', district: 'Nashik', state: 'Maharashtra', pincode: '422202' }, areaHectares: 2, soilType: 'loamy', irrigationType: 'drip' },
    ];
    const farms = [];
    for (const fd of farmsData) {
        let farm = await Farm.findOne({ owner: fd.owner, name: fd.name });
        if (!farm) farm = await Farm.create(fd);
        farms.push(farm);
    }
    console.log(`   Created ${farms.length} farms`);

    // ── STEP 3: Crops ──
    console.log('🌿 Step 3: Seeding Crops...');
    const now = new Date();
    const cropsData = [
        { farm: farms[0]._id, owner: raju._id, cropType: 'Rice', variety: 'Sona Masuri', plantedAt: new Date(now - 60 * 24 * 60 * 60 * 1000), expectedHarvest: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000), areaHectares: 5, yieldEstimateKg: 4500, status: 'growing', season: 'kharif', inputLog: [{ inputType: 'seed', name: 'Sona Masuri Seed', quantityKg: 100, costINR: 3500, appliedAt: new Date(now - 60 * 24 * 60 * 60 * 1000) }, { inputType: 'fertilizer', name: 'DAP 50kg', quantityKg: 250, costINR: 6750, appliedAt: new Date(now - 45 * 24 * 60 * 60 * 1000) }, { inputType: 'pesticide', name: 'Tricyclazole', quantityKg: 2, costINR: 1200, appliedAt: new Date(now - 20 * 24 * 60 * 60 * 1000) }] },
        { farm: farms[1]._id, owner: raju._id, cropType: 'Cotton', variety: 'BT Cotton', plantedAt: new Date(now - 90 * 24 * 60 * 60 * 1000), expectedHarvest: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), areaHectares: 3, yieldEstimateKg: 1800, status: 'growing', season: 'kharif', inputLog: [{ inputType: 'seed', name: 'BT Cotton Seed', quantityKg: 5, costINR: 8000, appliedAt: new Date(now - 90 * 24 * 60 * 60 * 1000) }, { inputType: 'fertilizer', name: 'Urea', quantityKg: 150, costINR: 4000, appliedAt: new Date(now - 60 * 24 * 60 * 60 * 1000) }, { inputType: 'pesticide', name: 'Imidacloprid', quantityKg: 1, costINR: 950, appliedAt: new Date(now - 30 * 24 * 60 * 60 * 1000) }] },
        { farm: farms[2]._id, owner: priya._id, cropType: 'Wheat', variety: 'Sharbati', plantedAt: new Date(now - 40 * 24 * 60 * 60 * 1000), expectedHarvest: new Date(now.getTime() + 80 * 24 * 60 * 60 * 1000), areaHectares: 4, yieldEstimateKg: 3200, status: 'growing', season: 'rabi', inputLog: [{ inputType: 'seed', name: 'Sharbati Wheat Seed', quantityKg: 160, costINR: 4800, appliedAt: new Date(now - 40 * 24 * 60 * 60 * 1000) }, { inputType: 'fertilizer', name: 'DAP + MOP', quantityKg: 200, costINR: 5500, appliedAt: new Date(now - 38 * 24 * 60 * 60 * 1000) }] },
        { farm: farms[3]._id, owner: priya._id, cropType: 'Tomato', variety: 'Arka Rakshak', plantedAt: new Date(now - 50 * 24 * 60 * 60 * 1000), expectedHarvest: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000), areaHectares: 1.5, yieldEstimateKg: 25000, status: 'growing', season: 'rabi', inputLog: [{ inputType: 'seed', name: 'Tomato Seedlings', quantityKg: 5, costINR: 3000, appliedAt: new Date(now - 50 * 24 * 60 * 60 * 1000) }, { inputType: 'fertilizer', name: '19:19:19 Complex', quantityKg: 50, costINR: 3500, appliedAt: new Date(now - 30 * 24 * 60 * 60 * 1000) }, { inputType: 'water', name: 'Drip Irrigation', quantityKg: 0, costINR: 2000, appliedAt: new Date(now - 10 * 24 * 60 * 60 * 1000) }] },
        { farm: farms[4]._id, owner: mohammed._id, cropType: 'Onion', variety: 'Nashik Red', plantedAt: new Date(now - 120 * 24 * 60 * 60 * 1000), expectedHarvest: new Date(now - 10 * 24 * 60 * 60 * 1000), actualHarvest: new Date(now - 10 * 24 * 60 * 60 * 1000), areaHectares: 6, yieldEstimateKg: 18000, actualYieldKg: 17500, status: 'harvested', season: 'rabi', revenueINR: 315000, inputLog: [{ inputType: 'seed', name: 'Onion Sets', quantityKg: 300, costINR: 15000, appliedAt: new Date(now - 120 * 24 * 60 * 60 * 1000) }, { inputType: 'fertilizer', name: 'DAP + Urea', quantityKg: 300, costINR: 9000, appliedAt: new Date(now - 100 * 24 * 60 * 60 * 1000) }] },
    ];
    for (const cd of cropsData) {
        const existing = await Crop.findOne({ farm: cd.farm, cropType: cd.cropType, status: cd.status });
        if (!existing) await Crop.create(cd);
    }
    console.log(`   Created ${cropsData.length} crops`);

    // ── STEP 4: Diseases ──
    console.log('🦠 Step 4: Seeding Diseases...');
    await seedDiseases();

    // ── STEP 5: Advisories ──
    console.log('📋 Step 5: Seeding Advisories...');
    await seedAdvisories();

    // ── STEP 6: Market Prices ──
    console.log('💰 Step 6: Seeding Market Prices...');
    const priceCount = await MarketPrice.countDocuments();
    if (priceCount === 0) {
        const commodities = [
            { commodity: 'Rice', market: 'Warangal APMC', state: 'Telangana', base: 2800 },
            { commodity: 'Wheat', market: 'Nagpur APMC', state: 'Maharashtra', base: 2400 },
            { commodity: 'Onion', market: 'Nashik APMC', state: 'Maharashtra', base: 1800 },
            { commodity: 'Cotton', market: 'Wardha APMC', state: 'Maharashtra', base: 6200 },
            { commodity: 'Tomato', market: 'Hyderabad Market', state: 'Telangana', base: 3500 },
        ];
        const priceRecords = [];
        for (const c of commodities) {
            for (let d = 29; d >= 0; d--) {
                const variation = (Math.random() - 0.5) * c.base * 0.2;
                const modal = Math.round(c.base + variation);
                priceRecords.push({ commodity: c.commodity, market: c.market, state: c.state, minPriceINR: Math.round(modal * 0.9), maxPriceINR: Math.round(modal * 1.1), modalPriceINR: modal, unit: 'quintal', priceDate: new Date(now - d * 24 * 60 * 60 * 1000) });
            }
        }
        await MarketPrice.insertMany(priceRecords);
        console.log(`   Created ${priceRecords.length} market price records`);
    } else {
        console.log(`   ⏭  Market prices already seeded (${priceCount} records)`);
    }

    // ── STEP 7: Listings ──
    console.log('🏪 Step 7: Seeding Listings...');
    const listingCount = await Listing.countDocuments();
    if (listingCount === 0) {
        const listingsData = [
            { farmer: raju._id, farm: farms[0]._id, title: 'Sona Masuri Rice — 500kg', cropType: 'Rice', variety: 'Sona Masuri', quantityKg: 500, availableKg: 500, askingPriceINR: 28, quality: 'A', availableFrom: new Date(), location: { lat: 17.98, lng: 79.59, district: 'Warangal', state: 'Telangana' } },
            { farmer: raju._id, farm: farms[1]._id, title: 'BT Cotton — 800kg', cropType: 'Cotton', variety: 'BT Cotton', quantityKg: 800, availableKg: 800, askingPriceINR: 62, quality: 'A', availableFrom: new Date(), location: { lat: 18.02, lng: 79.63, district: 'Warangal', state: 'Telangana' } },
            { farmer: priya._id, farm: farms[2]._id, title: 'Wheat Sharbati — 1000kg', cropType: 'Wheat', variety: 'Sharbati', quantityKg: 1000, availableKg: 1000, askingPriceINR: 24, quality: 'A', availableFrom: new Date(), location: { lat: 21.14, lng: 79.08, district: 'Nagpur', state: 'Maharashtra' } },
            { farmer: mohammed._id, farm: farms[4]._id, title: 'Nashik Red Onion — 2000kg', cropType: 'Onion', variety: 'Nashik Red', quantityKg: 2000, availableKg: 2000, askingPriceINR: 18, quality: 'A', availableFrom: new Date(), location: { lat: 20.01, lng: 73.77, district: 'Nashik', state: 'Maharashtra' } },
        ];
        await Listing.insertMany(listingsData);
        console.log(`   Created ${listingsData.length} listings`);
    } else {
        console.log(`   ⏭  Listings already seeded`);
    }

    // ── STEP 8: Orders ──
    console.log('📦 Step 8: Seeding Orders...');
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
        const listings = await Listing.find({});
        if (listings.length >= 3) {
            await Order.insertMany([
                { buyer: buyer1._id, seller: raju._id, listing: listings[0]._id, quantityKg: 200, pricePerKgINR: 28, totalAmountINR: 5600, status: 'delivered', statusHistory: [{ status: 'pending' }, { status: 'confirmed' }, { status: 'delivered' }], actualDeliveryDate: new Date(now - 5 * 24 * 60 * 60 * 1000) },
                { buyer: buyer2._id, seller: priya._id, listing: listings[2]._id, quantityKg: 500, pricePerKgINR: 24, totalAmountINR: 12000, status: 'confirmed', statusHistory: [{ status: 'pending' }, { status: 'confirmed' }] },
                { buyer: buyer3._id, seller: mohammed._id, listing: listings[3]._id, quantityKg: 1000, pricePerKgINR: 18, totalAmountINR: 18000, status: 'pending', statusHistory: [{ status: 'pending' }] },
            ]);
            console.log('   Created 3 orders');
        }
    } else {
        console.log(`   ⏭  Orders already seeded`);
    }

    // ── STEP 9: Group Orders ──
    console.log('👥 Step 9: Seeding Group Orders...');
    const groupCount = await GroupOrder.countDocuments();
    if (groupCount === 0) {
        await GroupOrder.insertMany([
            { title: 'DAP Fertilizer Bulk — Warangal Group', itemType: 'fertilizer', itemName: 'DAP 50kg Bags', targetQuantity: 1000, retailPriceINR: 1350, bulkPriceINR: 1150, location: { lat: 17.98, lng: 79.59, district: 'Warangal', state: 'Telangana' }, createdBy: raju._id, participants: [{ user: raju._id, quantityUnits: 200 }, { user: priya._id, quantityUnits: 300 }, { user: mohammed._id, quantityUnits: 150 }], closingDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000) },
            { title: 'Hybrid Rice Seed — Nagpur Group', itemType: 'seed', itemName: 'KRH-4 Hybrid Rice Seed', targetQuantity: 500, retailPriceINR: 450, bulkPriceINR: 350, location: { lat: 21.14, lng: 79.08, district: 'Nagpur', state: 'Maharashtra' }, createdBy: priya._id, participants: [{ user: priya._id, quantityUnits: 100 }], closingDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000) },
        ]);
        console.log('   Created 2 group orders');
    } else {
        console.log(`   ⏭  Group orders already seeded`);
    }

    // ── STEP 10: Pest Alerts ──
    console.log('🐛 Step 10: Seeding Pest Alerts...');
    const pestCount = await PestAlert.countDocuments();
    if (pestCount === 0) {
        await PestAlert.insertMany([
            { reportedBy: raju._id, pestType: 'Whitefly', cropAffected: 'Cotton', severity: 'severe', location: { lat: 17.98, lng: 79.59 }, affectedAreaHectares: 3, status: 'active' },
            { reportedBy: mohammed._id, pestType: 'Armyworm', cropAffected: 'Maize', severity: 'moderate', location: { lat: 20.01, lng: 73.77 }, affectedAreaHectares: 2, status: 'active' },
        ]);
        console.log('   Created 2 pest alerts');
    } else {
        console.log(`   ⏭  Pest alerts already seeded`);
    }

    // ── Summary ──
    console.log('\n============================');
    console.log('📊 Seed Summary:');
    const counts = {
        Users: await User.countDocuments(),
        Farms: await Farm.countDocuments(),
        Crops: await Crop.countDocuments(),
        MarketPrices: await MarketPrice.countDocuments(),
        Listings: await Listing.countDocuments(),
        Orders: await Order.countDocuments(),
        GroupOrders: await GroupOrder.countDocuments(),
        PestAlerts: await PestAlert.countDocuments(),
    };
    Object.entries(counts).forEach(([k, v]) => console.log(`   ${k}: ${v}`));
    console.log('\n🔑 Test Credentials:');
    console.log('   Admin:   admin@farmos.in    / Admin@123');
    console.log('   Farmer1: farmer1@test.in    / Test@123');
    console.log('   Farmer2: farmer2@test.in    / Test@123');
    console.log('   Farmer3: farmer3@test.in    / Test@123');
    console.log('   Buyer1:  buyer1@test.in     / Test@123');
    console.log('   Expert:  expert@farmos.in   / Expert@123');
    console.log('\n✅ Seeding complete!\n');

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch((err) => { console.error('❌ Seed failed:', err); process.exit(1); });
