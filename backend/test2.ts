import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function test() {
  let timeRange: string | undefined = '7';
  let dateFilter: any = undefined;
    
  if (timeRange && timeRange !== 'all') {
    const days = parseInt(timeRange, 10);
    if (!isNaN(days)) {
      const date = new Date();
      date.setDate(date.getDate() - days);
      dateFilter = { gte: date };
    }
  }

  const whereCreatedAt = dateFilter ? { createdAt: dateFilter } : undefined;
  const whereEnrolledAt = dateFilter ? { enrolledAt: dateFilter } : undefined;

  try {
    const totalUsers = await prisma.user.count({ where: whereCreatedAt });
    console.log('totalUsers', totalUsers);
    
    const activeEnrollments = await prisma.enrollment.count({
      where: { 
        status: 'ACTIVE',
        ...(dateFilter ? { enrolledAt: dateFilter } : {})
      }
    });
    console.log('activeEnrollments', activeEnrollments);

    const paymentsAggr = await prisma.payment.aggregate({ 
      _sum: { amount: true }, 
      where: { 
        status: 'COMPLETED',
        ...(dateFilter ? { createdAt: dateFilter } : {})
      } 
    });
    console.log('paymentsAggr', paymentsAggr);

    const activePrayerRequests = await prisma.prayerRequest.count({ where: whereCreatedAt });
    console.log('activePrayerRequests', activePrayerRequests);

  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}
test();
