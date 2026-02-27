import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL || "";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create Super Admin
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const superAdmin = await prisma.adminUser.upsert({
    where: { email: "admin@meddocproof.com" },
    update: {},
    create: {
      email: "admin@meddocproof.com",
      password: hashedPassword,
      fullName: "Super Admin",
      role: "super_admin",
      isActive: true,
      permissions: {
        dashboard: { view: true, create: true, edit: true, delete: true },
        applications: { view: true, create: true, edit: true, delete: true },
        doctors: { view: true, create: true, edit: true, delete: true },
        users: { view: true, create: true, edit: true, delete: true },
        certificates: { view: true, create: true, edit: true, delete: true },
        payments: { view: true, create: true, edit: true, delete: true },
        transactions: { view: true, create: true, edit: true, delete: true },
        coupons: { view: true, create: true, edit: true, delete: true },
        whatsapp: { view: true, create: true, edit: true, delete: true },
        support: { view: true, create: true, edit: true, delete: true },
        settings: { view: true, create: true, edit: true, delete: true },
        reviews: { view: true, create: true, edit: true, delete: true },
      },
    },
  });
  console.log(`✅ Super Admin created: ${superAdmin.email}`);

  // Create a sample Admin
  const admin = await prisma.adminUser.upsert({
    where: { email: "support@meddocproof.com" },
    update: {},
    create: {
      email: "support@meddocproof.com",
      password: hashedPassword,
      fullName: "Support Staff",
      role: "support",
      isActive: true,
      permissions: {
        dashboard: { view: true, create: false, edit: false, delete: false },
        applications: { view: true, create: false, edit: true, delete: false },
        doctors: { view: true, create: false, edit: false, delete: false },
        users: { view: true, create: false, edit: false, delete: false },
        certificates: { view: true, create: false, edit: false, delete: false },
        payments: { view: true, create: false, edit: false, delete: false },
        transactions: { view: true, create: false, edit: false, delete: false },
        coupons: { view: false, create: false, edit: false, delete: false },
        whatsapp: { view: true, create: true, edit: false, delete: false },
        support: { view: true, create: true, edit: true, delete: false },
        settings: { view: false, create: false, edit: false, delete: false },
        reviews: { view: true, create: false, edit: true, delete: false },
      },
    },
  });
  console.log(`✅ Support Admin created: ${admin.email}`);

  // Create a sample Doctor
  const doctorPassword = await bcrypt.hash("doctor123", 12);

  const doctor = await prisma.doctor.upsert({
    where: { email: "doctor@meddocproof.com" },
    update: {},
    create: {
      email: "doctor@meddocproof.com",
      password: doctorPassword,
      fullName: "Dr. Rajesh Kumar",
      phoneNumber: "+919876543210",
      registrationNumber: "MCI-12345",
      specialization: "General Medicine",
      qualification: "MBBS, MD",
      experience: 10,
      status: "approved",
      isActive: true,
      avgRating: 4.5,
      totalRatings: 25,
      consultationCount: 50,
      completedCertificates: 45,
    },
  });

  // Create doctor wallet
  await prisma.doctorWallet.upsert({
    where: { doctorId: doctor.id },
    update: {},
    create: {
      doctorId: doctor.id,
      balance: 5000,
      totalEarnings: 25000,
      totalWithdrawn: 20000,
    },
  });
  console.log(`✅ Doctor created: ${doctor.email}`);

  // Create sample settings
  const settings = [
    { key: "platform_fee", value: "199", description: "Platform fee per application in INR" },
    { key: "doctor_fee", value: "100", description: "Doctor fee per application in INR" },
    { key: "gst_percentage", value: "18", description: "GST percentage" },
    { key: "min_withdrawal", value: "500", description: "Minimum withdrawal amount in INR" },
    { key: "app_name", value: "MediProofDocs", description: "Application name" },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log(`✅ Settings created: ${settings.length} entries`);

  // ============================================
  // PHASE 7 — Enhanced Seed Data
  // ============================================

  // Create a test user
  const testUser = await prisma.user.upsert({
    where: { phoneNumber: "+919999900000" },
    update: {},
    create: {
      fullName: "Test User",
      phoneNumber: "+919999900000",
      email: "testuser@example.com",
      isVerified: true,
      status: "active",
    },
  });
  console.log(`✅ Test User created: ${testUser.phoneNumber}`);

  // Create sample applications
  const applicationData = [
    {
      userId: testUser.id,
      certificateType: "sick_leave" as const,
      status: "submitted" as const,
      formData: {
        fullName: "Test User",
        phoneNumber: "+919999900000",
        gender: "male",
        age: "30",
        reasonForCertificate: "Fever and body ache for 3 days",
      },
    },
    {
      userId: testUser.id,
      certificateType: "fitness" as const,
      status: "assigned" as const,
      assignedDoctorId: doctor.id,
      assignedAt: new Date(),
      formData: {
        fullName: "Test User",
        phoneNumber: "+919999900000",
        gender: "male",
        age: "30",
        reasonForCertificate: "Fitness certificate for new employment",
      },
    },
    {
      userId: testUser.id,
      certificateType: "work_from_home" as const,
      status: "completed" as const,
      assignedDoctorId: doctor.id,
      assignedAt: new Date(Date.now() - 7 * 86400000),
      paymentCompleted: true,
      certificateNumber: `MDC-${Date.now().toString(36).toUpperCase()}`,
      formData: {
        fullName: "Test User",
        phoneNumber: "+919999900000",
        gender: "male",
        age: "30",
        reasonForCertificate: "Back pain requiring work from home",
      },
    },
    {
      userId: testUser.id,
      certificateType: "caretaker" as const,
      status: "rejected" as const,
      formData: {
        fullName: "Test User",
        phoneNumber: "+919999900000",
        gender: "male",
        age: "30",
        reasonForCertificate: "Caretaker certificate for family member",
      },
    },
    {
      userId: testUser.id,
      certificateType: "recovery" as const,
      status: "pending_review" as const,
      assignedDoctorId: doctor.id,
      assignedAt: new Date(Date.now() - 2 * 86400000),
      formData: {
        fullName: "Test User",
        phoneNumber: "+919999900000",
        gender: "male",
        age: "30",
        reasonForCertificate: "Recovery certificate after surgery",
      },
    },
  ];

  let appCount = 0;
  for (const appData of applicationData) {
    const existing = await prisma.application.findFirst({
      where: {
        userId: appData.userId,
        certificateType: appData.certificateType,
      },
    });
    if (!existing) {
      await prisma.application.create({ data: appData });
      appCount++;
    }
  }
  console.log(`✅ Applications created: ${appCount} entries`);

  // Create sample coupons
  const coupons = [
    {
      code: "HEALTH20",
      discountType: "percentage",
      discountValue: 20,
      maxUses: 100,
      usedCount: 12,
      isActive: true,
      expiresAt: new Date(Date.now() + 90 * 86400000),
    },
    {
      code: "FLAT50",
      discountType: "fixed",
      discountValue: 50,
      maxUses: 50,
      usedCount: 5,
      isActive: true,
      expiresAt: new Date(Date.now() + 30 * 86400000),
    },
  ];

  for (const coupon of coupons) {
    const existing = await prisma.coupon.findUnique({ where: { code: coupon.code } });
    if (!existing) {
      await prisma.coupon.create({ data: coupon });
    }
  }
  console.log(`✅ Coupons created: ${coupons.length} entries`);

  // Create sample reviews (some approved, some pending)
  const reviews = [
    {
      title: "Rahul Sharma",
      message: "Excellent service! Got my sick leave certificate within 20 minutes. The doctor was professional and thorough during the consultation.",
      rating: 5,
      date: new Date(Date.now() - 10 * 86400000),
      approved: true,
    },
    {
      title: "Priya Patel",
      message: "Very convenient platform. The application process was smooth and the certificate was accepted by my employer without any issues.",
      rating: 4,
      date: new Date(Date.now() - 5 * 86400000),
      approved: true,
    },
    {
      title: "Amit Verma",
      message: "Good service but the waiting time was slightly longer than expected. Certificate quality is excellent though.",
      rating: 3,
      date: new Date(Date.now() - 2 * 86400000),
      approved: false,
    },
  ];

  const existingReviewCount = await prisma.review.count();
  if (existingReviewCount === 0) {
    for (const review of reviews) {
      await prisma.review.create({ data: review });
    }
    console.log(`✅ Reviews created: ${reviews.length} entries`);
  } else {
    console.log(`⏭️  Reviews already exist (${existingReviewCount}), skipping`);
  }

  // Create sample contact messages
  const contactMessages = [
    {
      name: "John Doe",
      email: "john@example.com",
      message: "I need help with my application. The payment went through but the status hasn't updated. My application ID is MDC-ABC123.",
      read: false,
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      message: "Can I get a bulk discount for our organization? We need fitness certificates for 50 employees.",
      read: true,
    },
  ];

  const existingMessageCount = await prisma.contactMessage.count();
  if (existingMessageCount === 0) {
    for (const msg of contactMessages) {
      await prisma.contactMessage.create({ data: msg });
    }
    console.log(`✅ Contact messages created: ${contactMessages.length} entries`);
  } else {
    console.log(`⏭️  Contact messages already exist (${existingMessageCount}), skipping`);
  }

  // Create sample notifications for the test user
  const notifications = [
    {
      userId: testUser.id,
      title: "Application Submitted",
      message: "Your sick leave certificate application has been submitted successfully. A doctor will be assigned shortly.",
      type: "application_update",
      isRead: false,
    },
    {
      userId: testUser.id,
      title: "Doctor Assigned",
      message: "Dr. Rajesh Kumar has been assigned to your fitness certificate application.",
      type: "doctor_assigned",
      isRead: false,
    },
    {
      userId: testUser.id,
      title: "Certificate Ready",
      message: "Your work from home certificate is ready for download.",
      type: "certificate_issued",
      isRead: true,
    },
  ];

  // Also create notifications for doctor and admin
  const doctorNotifications = [
    {
      doctorId: doctor.id,
      title: "New Application Assigned",
      message: "A new fitness certificate application has been assigned to you.",
      type: "new_application",
      isRead: false,
    },
  ];

  const adminNotifications = [
    {
      adminId: superAdmin.id,
      title: "New User Registration",
      message: "A new user has registered: Test User (+919999900000).",
      type: "user_registration",
      isRead: false,
    },
    {
      adminId: superAdmin.id,
      title: "Application Rejected",
      message: "A caretaker certificate application was rejected.",
      type: "application_update",
      isRead: true,
    },
  ];

  // Count existing notifications for the user to avoid duplicates
  const existingNotifCount = await prisma.notification.count({
    where: { userId: testUser.id },
  });
  if (existingNotifCount === 0) {
    for (const n of [...notifications, ...doctorNotifications, ...adminNotifications]) {
      await prisma.notification.create({ data: n });
    }
    console.log(`✅ Notifications created: ${notifications.length + doctorNotifications.length + adminNotifications.length} entries`);
  } else {
    console.log(`⏭️  Notifications already exist, skipping`);
  }

  console.log("\n🎉 Seeding complete!");
  console.log("\n📋 Login Credentials:");
  console.log("  Super Admin: admin@meddocproof.com / admin123");
  console.log("  Support:     support@meddocproof.com / admin123");
  console.log("  Doctor:      doctor@meddocproof.com / doctor123");
  console.log("  Test User:   +919999900000 (phone OTP login)");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
