const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { AnalyticsService } = require('./dist/analytics/analytics.service');

async function test() {
  const service = new AnalyticsService(prisma);
  try {
    const data = await service.getDashboardData('7');
    console.log('Success!', data.kpis);
  } catch (e) {
    console.error('Error in getDashboardData:', e);
  } finally {
    await prisma.$disconnect();
  }
}
test();
