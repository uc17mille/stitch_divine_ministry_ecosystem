import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  try {
    // 1. Get two courses
    const courses = await prisma.course.findMany({ take: 2 });
    if (courses.length < 2) {
      console.log('Not enough courses to attach templates. Run main seed first.');
      return;
    }

    console.log('Cleaning old templates...');
    await prisma.certificateTemplate.deleteMany();

    console.log('Creating Certificate Templates...');
    await prisma.certificateTemplate.create({
      data: {
        name: 'Lumora SaaS Pro - Light UI',
        courseId: courses[0].id,
        backgroundUrl: '/uploads/certificates/default_blue_gold.png',
        mappingConfig: JSON.stringify({
          studentName: { x: 400, y: 300, fontSize: 48, font: 'Inter', color: '#0f172a' },
          courseName: { x: 400, y: 400, fontSize: 24, font: 'Inter', color: '#64748b' },
          date: { x: 200, y: 550, fontSize: 16, font: 'Inter', color: '#94a3b8' }
        })
      }
    });

    await prisma.certificateTemplate.create({
      data: {
        name: 'Lumora SaaS Pro - Dark UI',
        courseId: courses[1].id,
        backgroundUrl: '/uploads/certificates/default_dark_glass.png',

        mappingConfig: JSON.stringify({
          studentName: { x: 400, y: 300, fontSize: 48, font: 'Outfit', color: '#ffffff' },
          courseName: { x: 400, y: 400, fontSize: 24, font: 'Outfit', color: '#94a3b8' },
          date: { x: 200, y: 550, fontSize: 16, font: 'Outfit', color: '#64748b' }
        })
      }
    });

    console.log('Successfully seeded 2 premium certificate templates!');

  } catch (error) {
    console.error('Error seeding templates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
