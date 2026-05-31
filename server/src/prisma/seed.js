require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Seed uchun oddiy PrismaClient (adapter kerak emas)
const prisma = new PrismaClient();

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function monthsAgo(n, day = 1) {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  d.setDate(day);
  return d;
}

async function main() {
  console.log('🌱 Seed boshlandi...');

  // Eski ma'lumotlarni tozalash
  await prisma.expense.deleteMany();
  await prisma.income.deleteMany();
  await prisma.user.deleteMany();

  // ── Admin ──────────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      fullName: 'Super Admin',
      email:    'admin@example.com',
      password: adminPassword,
      role:     'ADMIN',
      status:   'ACTIVE',
    },
  });
  console.log(`✅ Admin yaratildi: ${admin.email}`);

  // ── Users ──────────────────────────────────────────────────────────────────
  const userPassword = await bcrypt.hash('password123', 12);

  const user1 = await prisma.user.create({
    data: { fullName: 'Alisher Karimov', email: 'alisher@example.com', password: userPassword, role: 'USER', status: 'ACTIVE' },
  });
  const user2 = await prisma.user.create({
    data: { fullName: 'Malika Yusupova', email: 'malika@example.com', password: userPassword, role: 'USER', status: 'ACTIVE' },
  });
  const user3 = await prisma.user.create({
    data: { fullName: 'Bobur Rahimov', email: 'bobur@example.com', password: userPassword, role: 'USER', status: 'INACTIVE' },
  });
  const user4 = await prisma.user.create({
    data: { fullName: 'Nilufar Karimova', email: 'nilufar@example.com', password: userPassword, role: 'USER', status: 'ACTIVE' },
  });
  console.log('✅ 4 ta user yaratildi');

  // ── Incomes for user1 ──────────────────────────────────────────────────────
  await prisma.income.createMany({
    data: [
      { userId: user1.id, title: 'Oylik maosh',      amount: 5000000, category: 'Maosh',        date: daysAgo(1),       description: 'Iyun oyi maoshi' },
      { userId: user1.id, title: 'Freelance loyiha', amount: 1500000, category: 'Freelance',    date: daysAgo(3),       description: 'Web sayt loyihasi' },
      { userId: user1.id, title: 'Ijara daromadi',   amount: 800000,  category: 'Ijara',        date: daysAgo(5),       description: 'Kvartira ijarasi' },
      { userId: user1.id, title: 'Investitsiya',     amount: 300000,  category: 'Investitsiya', date: daysAgo(8),       description: 'Aksiya dividendi' },
      { userId: user1.id, title: 'Biznes daromadi',  amount: 2000000, category: 'Biznes',       date: daysAgo(10),      description: "Do'kon savdosi" },
      { userId: user1.id, title: 'Oylik maosh',      amount: 5000000, category: 'Maosh',        date: monthsAgo(1, 1),  description: 'May maoshi' },
      { userId: user1.id, title: 'Freelance',        amount: 1200000, category: 'Freelance',    date: monthsAgo(1, 10), description: 'Mobile app' },
      { userId: user1.id, title: 'Oylik maosh',      amount: 4800000, category: 'Maosh',        date: monthsAgo(2, 1),  description: 'Aprel maoshi' },
    ],
  });

  // ── Expenses for user1 ─────────────────────────────────────────────────────
  await prisma.expense.createMany({
    data: [
      { userId: user1.id, title: 'Oziq-ovqat', amount: 800000,  category: 'Oziq-ovqat',   date: daysAgo(1),       description: 'Supermarket' },
      { userId: user1.id, title: 'Transport',  amount: 200000,  category: 'Transport',    date: daysAgo(2),       description: 'Taksi' },
      { userId: user1.id, title: 'Kommunal',   amount: 350000,  category: 'Kommunal',     date: daysAgo(4),       description: 'Gaz, suv, elektr' },
      { userId: user1.id, title: 'Internet',   amount: 120000,  category: 'Internet',     date: daysAgo(6),       description: 'Uy interneti' },
      { userId: user1.id, title: 'Kiyim',      amount: 600000,  category: 'Kiyim',        date: daysAgo(7),       description: 'Yozgi kiyimlar' },
      { userId: user1.id, title: 'Restoran',   amount: 250000,  category: "Ko'ngilochar", date: daysAgo(9),       description: 'Tushlik' },
      { userId: user1.id, title: 'Oziq-ovqat', amount: 750000,  category: 'Oziq-ovqat',   date: monthsAgo(1, 3),  description: 'Bozor' },
      { userId: user1.id, title: 'Kommunal',   amount: 320000,  category: 'Kommunal',     date: monthsAgo(1, 12), description: "To'lovlar" },
    ],
  });

  // ── user2 ──────────────────────────────────────────────────────────────────
  await prisma.income.createMany({
    data: [
      { userId: user2.id, title: 'Oylik maosh', amount: 4500000, category: 'Maosh',     date: daysAgo(2),  description: 'Iyun maoshi' },
      { userId: user2.id, title: 'Freelance',   amount: 900000,  category: 'Freelance', date: daysAgo(6),  description: 'Dizayn ishi' },
      { userId: user2.id, title: 'Biznes',      amount: 1200000, category: 'Biznes',    date: daysAgo(12), description: 'Savdo' },
    ],
  });
  await prisma.expense.createMany({
    data: [
      { userId: user2.id, title: 'Oziq-ovqat', amount: 650000, category: 'Oziq-ovqat', date: daysAgo(1), description: 'Supermarket' },
      { userId: user2.id, title: 'Transport',  amount: 180000, category: 'Transport',  date: daysAgo(3), description: 'Avtobus' },
      { userId: user2.id, title: 'Kiyim',      amount: 900000, category: 'Kiyim',      date: daysAgo(8), description: 'Yangi kiyim' },
    ],
  });

  // ── user3 ──────────────────────────────────────────────────────────────────
  await prisma.income.createMany({
    data: [
      { userId: user3.id, title: 'Maosh',           amount: 3800000, category: 'Maosh',     date: daysAgo(1), description: 'Iyun' },
      { userId: user3.id, title: "Qo'shimcha ish",  amount: 600000,  category: 'Freelance', date: daysAgo(7), description: 'Tarjima' },
    ],
  });
  await prisma.expense.createMany({
    data: [
      { userId: user3.id, title: 'Oziq-ovqat', amount: 500000, category: 'Oziq-ovqat', date: daysAgo(2), description: 'Bozor' },
      { userId: user3.id, title: 'Kommunal',   amount: 280000, category: 'Kommunal',   date: daysAgo(5), description: "To'lovlar" },
    ],
  });

  // ── user4 ──────────────────────────────────────────────────────────────────
  await prisma.income.createMany({
    data: [
      { userId: user4.id, title: 'Oylik maosh',  amount: 6000000, category: 'Maosh',        date: daysAgo(1), description: 'Iyun' },
      { userId: user4.id, title: 'Investitsiya', amount: 500000,  category: 'Investitsiya', date: daysAgo(4), description: 'Fond' },
    ],
  });
  await prisma.expense.createMany({
    data: [
      { userId: user4.id, title: "Ta'lim",     amount: 800000, category: "Ta'lim",     date: daysAgo(1), description: 'Kurs' },
      { userId: user4.id, title: 'Oziq-ovqat', amount: 700000, category: 'Oziq-ovqat', date: daysAgo(3), description: 'Supermarket' },
    ],
  });

  console.log("✅ Demo ma'lumotlar yaratildi");
  console.log('\n📋 Login ma\'lumotlari:');
  console.log('   Admin:  admin@example.com  / admin123');
  console.log('   User 1: alisher@example.com / password123');
  console.log('   User 2: malika@example.com  / password123');
  console.log('   User 3: bobur@example.com   / password123 (bloklangan)');
  console.log('   User 4: nilufar@example.com / password123');
}

main()
  .catch(e => { console.error('❌ Seed xatosi:', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
