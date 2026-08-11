import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({});
  }
  async onModuleInit() {
    try {
      await this.$connect();
      // Run autoSeed asynchronously in background so container responds instantly to HTTP requests!
      this.autoSeed().catch((err) => console.error('Background seed error:', err));
    } catch (err) {
      console.error('⚠️ Database connection deferred or failed:', err);
    }
  }

  public async autoSeed() {
    try {
      console.log('🌱 Checking and seeding ecosystem accounts & data...');

      // 1. User Accounts (Check if admin exists first to avoid unnecessary bcrypt hashing!)
      const adminExists = await this.user.findUnique({ where: { email: 'admin@auramini.com' } });
      if (!adminExists) {
        const adminHash = await bcrypt.hash('Admin@12345', 10);
        try {
          await this.user.upsert({
            where: { email: 'admin@auramini.com' },
            update: { passwordHash: adminHash },
            create: {
              email: 'admin@auramini.com',
              passwordHash: adminHash,
              role: 'ADMINISTRATOR',
              profile: { create: { firstName: 'Aura', lastName: 'Admin', bio: 'Platform administrator' } },
            },
          });
        } catch (e) {
          console.error('Failed to seed admin user:', e);
        }
      }

      const mentorHash = await bcrypt.hash('Mentor@12345', 12);
      let mentor;
      try {
        mentor = await this.user.upsert({
          where: { email: 'mentor@auramini.com' },
          update: { passwordHash: mentorHash },
          create: {
            email: 'mentor@auramini.com',
            passwordHash: mentorHash,
            role: 'MENTOR',
            profile: { create: { firstName: 'Dr. Elias', lastName: 'Thorne', bio: 'Senior pastor and leadership coach with 20 years of ministry experience.' } },
          },
        });
      } catch (e) {
        console.error('Failed to seed mentor user:', e);
      }

      const studentHash = await bcrypt.hash('Student@12345', 12);
      try {
        await this.user.upsert({
          where: { email: 'student@auramini.com' },
          update: { passwordHash: studentHash },
          create: {
            email: 'student@auramini.com',
            passwordHash: studentHash,
            role: 'STUDENT',
            profile: { create: { firstName: 'Grace', lastName: 'Adeyemi' } },
          },
        });
      } catch (e) {
        console.error('Failed to seed student user:', e);
      }

      // 2. Categories
      const cat1 = await this.courseCategory.upsert({ where: { name: 'Leadership' }, update: {}, create: { name: 'Leadership', description: 'Ministry leadership courses' } });
      const cat2 = await this.courseCategory.upsert({ where: { name: 'Theology' }, update: {}, create: { name: 'Theology', description: 'Biblical theology courses' } });
      const cat3 = await this.courseCategory.upsert({ where: { name: 'Worship' }, update: {}, create: { name: 'Worship', description: 'Worship and music ministry' } });

      // 3. Prayer Categories
      await this.prayerCategory.upsert({ where: { name: 'Health & Healing' }, update: {}, create: { name: 'Health & Healing' } });
      await this.prayerCategory.upsert({ where: { name: 'Financial Breakthrough' }, update: {}, create: { name: 'Financial Breakthrough' } });
      await this.prayerCategory.upsert({ where: { name: 'Family & Relationships' }, update: {}, create: { name: 'Family & Relationships' } });
      await this.prayerCategory.upsert({ where: { name: 'Spiritual Growth' }, update: {}, create: { name: 'Spiritual Growth' } });

      // 4. Courses with Modules & Lessons (if empty)
      const courseCount = await this.course.count();
      if (courseCount === 0) {
        const course1 = await this.course.create({
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

        const course2 = await this.course.create({
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

        await this.course.create({
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

        // 5. Mentorship Track
        await this.mentorshipTrack.create({
          data: { name: 'Pastoral Leadership Intensive', description: 'A 12-week intensive mentorship journey focusing on leadership, preaching, and ministry management.', mentorId: mentor.id }
        });

        // 6. Events
        await this.event.create({ data: { title: 'Global Ministry Summit 2026', description: 'Annual gathering of ministry leaders from 140+ nations.', location: 'Lagos, Nigeria', startTime: new Date('2026-08-15T09:00:00'), endTime: new Date('2026-08-17T17:00:00'), capacity: 500 } });
        await this.event.create({ data: { title: 'Digital Evangelism Workshop', description: 'Master the tools to reach souls in the digital space.', location: 'Online (Zoom)', startTime: new Date('2026-07-25T14:00:00'), endTime: new Date('2026-07-25T17:00:00'), capacity: 200 } });

        // 7. Resource Library
        await this.resourceLibrary.createMany({
          data: [
            { title: 'Ministry Leadership Handbook', description: 'A comprehensive guide for ministry leaders at all levels.', url: 'https://example.com/resources/leadership-handbook.pdf' },
            { title: 'Bible Study Guide: Psalms', description: 'Deep dive into the Book of Psalms with reflection questions.', url: 'https://example.com/resources/psalms-guide.pdf' },
            { title: 'Prayer & Intercession Manual', description: 'Practical tools for building a thriving prayer ministry.', url: 'https://example.com/resources/prayer-manual.pdf' },
          ]
        });

        // 8. Announcement
        await this.announcement.create({ data: { title: 'Welcome to Aura Ministry!', content: 'We are thrilled to launch the Aura Ministry Ecosystem. Explore courses, connect with mentors, and join the global community!' } });

        // 9. Certificate Templates
        await this.certificateTemplate.create({
          data: {
            name: 'Lumora SaaS Pro - Light UI',
            courseId: course1.id,
            backgroundUrl: '/uploads/certificates/default_blue_gold.png',
            mappingConfig: JSON.stringify({
              studentName: { x: 400, y: 300, fontSize: 48, font: 'Inter', color: '#0f172a' },
              courseName: { x: 400, y: 400, fontSize: 24, font: 'Inter', color: '#64748b' },
              date: { x: 200, y: 550, fontSize: 16, font: 'Inter', color: '#94a3b8' }
            })
          }
        });

        await this.certificateTemplate.create({
          data: {
            name: 'Lumora SaaS Pro - Dark UI',
            courseId: course2.id,
            backgroundUrl: '/uploads/certificates/default_dark_glass.png',
            mappingConfig: JSON.stringify({
              studentName: { x: 400, y: 300, fontSize: 48, font: 'Outfit', color: '#ffffff' },
              courseName: { x: 400, y: 400, fontSize: 24, font: 'Outfit', color: '#94a3b8' },
              date: { x: 200, y: 550, fontSize: 16, font: 'Outfit', color: '#64748b' }
            })
          }
        });

        console.log('✅ Full ecosystem database seeded into PostgreSQL successfully!');
      }
    } catch (err) {
      console.error('Auto-seed error:', err);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

