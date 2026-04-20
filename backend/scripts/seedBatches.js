import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Batch from '../src/models/Batch.js';
import User from '../src/models/User.js';

dotenv.config();

const demoBatches = [
  {
    cropName: 'Tomatoes',
    origin: 'Farm A, Maharashtra',
    currentLocation: 'Cold Storage Unit 1',
    storageUnit: 'CS-001',
    temperature: 4.2,
    humidity: 85,
    gasLevel: 'Normal',
    status: 'In Storage',
    riskLevel: 'Low',
    quantity: 500,
    harvestDate: new Date('2024-03-01T06:00:00Z'),
    expectedShelfLife: 14,
    currentShelfLife: 13,
    destination: 'Mandi X, Delhi'
  },
  {
    cropName: 'Bananas',
    origin: 'Farm B, Karnataka',
    currentLocation: 'In Transit',
    storageUnit: 'REEFER-002',
    temperature: 13.5,
    humidity: 90,
    gasLevel: 'Normal',
    status: 'In Transit',
    riskLevel: 'Medium',
    quantity: 300,
    harvestDate: new Date('2024-03-01T16:00:00Z'),
    expectedShelfLife: 7,
    currentShelfLife: 6,
    destination: 'Distribution Center, Mumbai'
  },
  {
    cropName: 'Mangoes',
    origin: 'Farm C, Andhra Pradesh',
    currentLocation: 'Cold Storage Unit 2',
    storageUnit: 'CS-002',
    temperature: 10.0,
    humidity: 88,
    gasLevel: 'Elevated',
    status: 'In Storage',
    riskLevel: 'High',
    quantity: 750,
    harvestDate: new Date('2024-03-01T10:00:00Z'),
    expectedShelfLife: 21,
    currentShelfLife: 20,
    destination: 'Export Terminal, Chennai'
  },
  {
    cropName: 'Leafy Greens',
    origin: 'Farm D, Tamil Nadu',
    currentLocation: 'Cold Storage Unit 3',
    storageUnit: 'CS-003',
    temperature: 2.5,
    humidity: 95,
    gasLevel: 'Normal',
    status: 'In Storage',
    riskLevel: 'Low',
    quantity: 150,
    harvestDate: new Date('2024-03-02T01:00:00Z'),
    expectedShelfLife: 5,
    currentShelfLife: 4,
    destination: 'Local Market, Chennai'
  }
];

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected.');

    // We need an owner for the batches (use the first user in the DB)
    const user = await User.findOne({});
    if (!user) {
      console.log('No user found in the database. Please create a user first via the app frontend.');
      process.exit(1);
    }

    console.log(`Using user ${user.fullName} (${user._id}) as owner.`);

    // Clear existing batches
    await Batch.deleteMany({});
    console.log('Cleared existing batches.');

    // Insert demo batches
    const batchesToInsert = demoBatches.map((batch, index) => {
      // Generate a batchId similar to the one in the mock
      const batchId = `${batch.cropName.substring(0, 3).toUpperCase()}-2024-00${index + 1}`;
      return {
        ...batch,
        batchId,
        owner: user._id
      };
    });

    await Batch.insertMany(batchesToInsert);
    console.log(`Successfully seeded ${batchesToInsert.length} batches.`);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding DB:', err);
    process.exit(1);
  }
};

seedDB();
