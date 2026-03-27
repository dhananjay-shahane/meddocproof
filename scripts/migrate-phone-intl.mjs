/**
 * One-time migration: prepend +91 to any phoneNumber that doesn't already start with +
 * Run: node scripts/migrate-phone-intl.mjs
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Fetch all users whose phoneNumber does NOT start with "+"
  const users = await prisma.user.findMany({
    where: { phoneNumber: { not: { startsWith: "+" } } },
    select: { id: true, phoneNumber: true },
  });

  console.log(`Found ${users.length} user(s) with bare phone numbers.`);

  for (const user of users) {
    const updated = "+91" + user.phoneNumber.replace(/\D/g, "");
    await prisma.user.update({
      where: { id: user.id },
      data: { phoneNumber: updated },
    });
    console.log(`  Updated ${user.phoneNumber} → ${updated}`);
  }

  console.log("Done.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
