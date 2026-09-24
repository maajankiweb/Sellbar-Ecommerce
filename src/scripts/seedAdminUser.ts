import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { hashPassword } from '../lib/auth/security/passwordHasher';
import User from '../lib/db/models/User';

// Parse .env.local manually
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [k, ...v] = trimmed.split('=');
        if (!process.env[k.trim()]) {
          process.env[k.trim()] = v.join('=').trim();
        }
      }
    });
  }
} catch (e) {
  // Ignore
}

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  'mongodb+srv://maajankiweb_db_user:2dtSdEb8XcUtschQ@cluster0.ovhbcst.mongodb.net/selbar?retryWrites=true&w=majority&appName=Cluster0';

async function seedAdmin() {
  console.log('Connecting to MongoDB Atlas at:', MONGO_URI.replace(/:([^@]+)@/, ':****@'));
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB Atlas successfully.');

  const adminEmail = 'admin@selbar.in';
  const adminMobile = '9999999999';
  const adminUsername = 'admin';
  const adminPassword = 'Admin@Selbar2026!';

  const passwordHash = await hashPassword(adminPassword);

  const existingUser = await User.findOne({
    $or: [
      { 'email.normalized': adminEmail },
      { 'username.normalized': adminUsername },
      { email: adminEmail },
      { username: adminUsername },
    ],
  });

  if (existingUser) {
    console.log(`Found existing user (${existingUser.email?.value || existingUser.email || existingUser.username}). Updating to super_admin...`);
    existingUser.fullName = 'System Administrator';
    existingUser.roles = ['super_admin', 'admin', 'customer'];
    existingUser.status = 'active';
    existingUser.passwordHash = passwordHash;
    existingUser.email = {
      value: adminEmail,
      normalized: adminEmail,
      verified: true,
      verifiedAt: new Date(),
    };
    existingUser.mobile = {
      countryCode: '+91',
      number: adminMobile,
      normalized: `+91${adminMobile}`,
      verified: true,
      verifiedAt: new Date(),
    };
    existingUser.username = {
      value: adminUsername,
      normalized: adminUsername,
    };
    existingUser.security = {
      failedLoginAttempts: 0,
      twoFactorEnabled: false,
      lastPasswordChange: new Date(),
    };
    await existingUser.save();
    console.log('Super Admin user updated successfully.');
  } else {
    console.log('Creating new Super Admin user...');
    await User.create({
      fullName: 'System Administrator',
      email: {
        value: adminEmail,
        normalized: adminEmail,
        verified: true,
        verifiedAt: new Date(),
      },
      mobile: {
        countryCode: '+91',
        number: adminMobile,
        normalized: `+91${adminMobile}`,
        verified: true,
        verifiedAt: new Date(),
      },
      username: {
        value: adminUsername,
        normalized: adminUsername,
      },
      passwordHash,
      roles: ['super_admin', 'admin', 'customer'],
      status: 'active',
      security: {
        failedLoginAttempts: 0,
        twoFactorEnabled: false,
        lastPasswordChange: new Date(),
      },
      profile: {
        completionPercentage: 100,
      },
      consent: {
        termsAccepted: true,
        privacyAccepted: true,
        acceptedAt: new Date(),
        termsVersion: 'v1.0',
        privacyVersion: 'v1.0',
      },
    });
    console.log('Super Admin user created successfully.');
  }

  console.log('\n=============================================');
  console.log('  ADMIN DASHBOARD LOGIN CREDENTIALS          ');
  console.log('=============================================');
  console.log(`  Login URL:   http://localhost:3000/login`);
  console.log(`  Admin Panel: http://localhost:3000/admin`);
  console.log(`  Identifier:  ${adminEmail} (or username: admin)`);
  console.log(`  Password:    ${adminPassword}`);
  console.log(`  Role:        super_admin (Full Access)`);
  console.log('=============================================\n');

  await mongoose.disconnect();
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error('Failed to seed admin user:', err);
  process.exit(1);
});
