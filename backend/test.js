const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function test() {
  try {
    const topCourses = await prisma.course.findMany({
      take: 4,
      orderBy: {
        enrollments: { _count: 'desc' }
      },
      include: {
        category: true,
        _count: { select: { enrollments: true } }
      }
    });
    console.log('Success:', topCourses);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}
test();
