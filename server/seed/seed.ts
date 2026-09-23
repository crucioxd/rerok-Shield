import dotenv from 'dotenv';
dotenv.config();

import { db } from '../config/db';

async function runSeed() {
  console.log('============================================');
  console.log('  REROK Shield - Database Seeding Script    ');
  console.log('============================================');
  await db.init();
  await db.seedLocalStore();
  console.log('\nSeed completed successfully!');
  console.log('--------------------------------------------');
  console.log('Demo Admin Credentials:');
  console.log('Email:    admin@rerok.com');
  console.log('Password: Admin@123');
  console.log('Role:     admin');
  console.log('--------------------------------------------');
  console.log('Demo Customer Credentials:');
  console.log('Email:    user@rerok.com');
  console.log('Password: User@123');
  console.log('Role:     customer');
  console.log('============================================\n');
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('Seed script failed:', err);
  process.exit(1);
});
