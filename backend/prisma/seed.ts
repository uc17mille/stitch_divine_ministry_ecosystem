import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient({});

async function main() {
  console.log('🌱 Seeding database...');

  // Categories
  const cat1 = await prisma.courseCategory.upsert({ where: { name: 'Leadership' }, update: {}, create: { name: 'Leadership', description: 'Ministry leadership courses' } });
  const cat2 = await prisma.courseCategory.upsert({ where: { name: 'Theology' }, update: {}, create: { name: 'Theology', description: 'Biblical theology courses' } });
  const cat3 = await prisma.courseCategory.upsert({ where: { name: 'Worship' }, update: {}, create: { name: 'Worship', description: 'Worship and music ministry' } });

  // Prayer Categories
  const pcat1 = await prisma.prayerCategory.upsert({ where: { name: 'Health & Healing' }, update: {}, create: { name: 'Health & Healing' } });
  const pcat2 = await prisma.prayerCategory.upsert({ where: { name: 'Financial Breakthrough' }, update: {}, create: { name: 'Financial Breakthrough' } });
  await prisma.prayerCategory.upsert({ where: { name: 'Family & Relationships' }, update: {}, create: { name: 'Family & Relationships' } });
  await prisma.prayerCategory.upsert({ where: { name: 'Spiritual Growth' }, update: {}, create: { name: 'Spiritual Growth' } });

  // Admin User
  const adminHash = await bcrypt.hash('Admin@12345', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@auramini.com' },
    update: {},
    create: {
      email: 'admin@auramini.com',
      passwordHash: adminHash,
      role: 'ADMINISTRATOR',
      profile: { create: { firstName: 'Aura', lastName: 'Admin', bio: 'Platform administrator' } },
    },
  });

  // Mentor User
  const mentorHash = await bcrypt.hash('Mentor@12345', 12);
  const mentor = await prisma.user.upsert({
    where: { email: 'mentor@auramini.com' },
    update: {},
    create: {
      email: 'mentor@auramini.com',
      passwordHash: mentorHash,
      role: 'MENTOR',
      profile: { create: { firstName: 'Dr. Elias', lastName: 'Thorne', bio: 'Senior pastor and leadership coach with 20 years of ministry experience.' } },
    },
  });

  // Student User
  const studentHash = await bcrypt.hash('Student@12345', 12);
  await prisma.user.upsert({
    where: { email: 'student@auramini.com' },
    update: {},
    create: {
      email: 'student@auramini.com',
      passwordHash: studentHash,
      role: 'STUDENT',
      profile: { create: { firstName: 'Grace', lastName: 'Adeyemi' } },
    },
  });

  // Courses
  const course1 = await prisma.course.create({
    data: {
      title: 'The Modern Pastoral Heart',
      description: 'Explore what it means to lead a ministry in the digital age. From emotional intelligence to servant leadership, this course equips you with timeless and modern tools.',
      categoryId: cat1.id,
      modules: {
        create: [
          {
            title: 'Module 1: Foundations of Pastoral Leadership',
            orderIndex: 1,
            lessons: {
              create: [
                { title: 'What is Servant Leadership?', orderIndex: 1, content: 'An exploration of servant leadership in the context of pastoral ministry.' },
                { title: 'Emotional Intelligence in Ministry', orderIndex: 2, content: 'How EQ shapes effective pastoral care.' },
              ]
            }
          },
          {
            title: 'Module 2: Digital Ministry',
            orderIndex: 2,
            lessons: {
              create: [
                { title: 'Building an Online Congregation', orderIndex: 1, content: 'Strategies for building community in the digital space.' },
              ]
            }
          }
        ]
      }
    }
  });

  await prisma.course.create({
    data: {
      title: 'Systematic Theology for Leaders',
      description: 'A comprehensive study of Christian doctrine designed to ground ministry leaders in sound biblical theology.',
      categoryId: cat2.id,
      modules: {
        create: [{
          title: 'Module 1: The Nature of God',
          orderIndex: 1,
          lessons: {
            create: [
              { title: 'Attributes of God', orderIndex: 1, content: 'Exploring the eternal attributes of the divine.' },
              { title: 'The Trinity Explained', orderIndex: 2, content: 'Understanding the Trinitarian nature of God.' },
            ]
          }
        }]
      }
    }
  });

  await prisma.course.create({
    data: {
      title: 'Worship & Spiritual Formation',
      description: 'Develop your worship ministry with practical techniques and a deep understanding of spiritual disciplines.',
      categoryId: cat3.id,
      modules: {
        create: [{
          title: 'Module 1: The Heart of Worship',
          orderIndex: 1,
          lessons: {
            create: [{ title: 'Leading with Authenticity', orderIndex: 1, content: 'Authentic worship begins in the heart.' }]
          }
        }]
      }
    }
  });

  // Mentorship Track
  await prisma.mentorshipTrack.create({
    data: { name: 'Pastoral Leadership Intensive', description: 'A 12-week intensive mentorship journey focusing on leadership, preaching, and ministry management.', mentorId: mentor.id }
  });

  // Events
  await prisma.event.create({ data: { title: 'Global Ministry Summit 2026', description: 'Annual gathering of ministry leaders from 140+ nations.', location: 'Lagos, Nigeria', startTime: new Date('2026-08-15T09:00:00'), endTime: new Date('2026-08-17T17:00:00'), capacity: 500 } });
  await prisma.event.create({ data: { title: 'Digital Evangelism Workshop', description: 'Master the tools to reach souls in the digital space.', location: 'Online (Zoom)', startTime: new Date('2026-07-25T14:00:00'), endTime: new Date('2026-07-25T17:00:00'), capacity: 200 } });

  // Resources
  await prisma.resourceLibrary.createMany({
    data: [
      { title: 'Ministry Leadership Handbook', description: 'A comprehensive guide for ministry leaders at all levels.', url: 'https://example.com/resources/leadership-handbook.pdf' },
      { title: 'Bible Study Guide: Psalms', description: 'Deep dive into the Book of Psalms with reflection questions.', url: 'https://example.com/resources/psalms-guide.pdf' },
      { title: 'Prayer & Intercession Manual', description: 'Practical tools for building a thriving prayer ministry.', url: 'https://example.com/resources/prayer-manual.pdf' },
    ]
  });

  // Announcement
  await prisma.announcement.create({ data: { title: 'Welcome to Aura Ministry!', content: 'We are thrilled to launch the Aura Ministry Ecosystem. Explore courses, connect with mentors, and join the global community!' } });

  console.log('✅ Database seeded successfully!');
  console.log('\nTest accounts:');
  console.log('Admin:   admin@auramini.com / Admin@12345');
  console.log('Mentor:  mentor@auramini.com / Mentor@12345');
  console.log('Student: student@auramini.com / Student@12345');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
