const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv/config');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const p = new PrismaClient({ adapter });

async function main() {
  const count = await p.application.count();
  console.log('Found', count, 'applications');
  
  // Delete related records first (respect FK constraints)
  const pay = await p.payment.deleteMany();
  console.log('Deleted', pay.count, 'payments');
  
  const rem = await p.remark.deleteMany();
  console.log('Deleted', rem.count, 'remarks');
  
  const doc = await p.document.deleteMany();
  console.log('Deleted', doc.count, 'documents');
  
  const notif = await p.notification.deleteMany();
  console.log('Deleted', notif.count, 'notifications');
  
  // Delete all applications
  const del = await p.application.deleteMany();
  console.log('Deleted', del.count, 'applications');
  
  // Also clear transactions
  const tx = await p.transaction.deleteMany();
  console.log('Deleted', tx.count, 'transactions');
  
  console.log('Cleanup complete!');
  await p.$disconnect();
}

main().catch(function(e) { console.error(e); process.exit(1); });
