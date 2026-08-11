import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient({});

const students = [
  {
    firstName: 'Samuel',
    lastName: 'Johnson',
    email: 'samuel.johnson@auramini.com',
    bio: 'Looking forward to deepening my pastoral leadership skills and connecting with the community.',
  },
  {
    firstName: 'Hannah',
    lastName: 'Smith',
    email: 'hannah.smith@auramini.com',
    bio: 'Dedicated youth coordinator passionate about digital evangelism and media ministries.',
  },
  {
    firstName: 'Caleb',
    lastName: 'Peterson',
    email: 'caleb.peterson@auramini.com',
    bio: 'Theology student exploring covenant relationships and modern church structures.',
  },
  {
    firstName: 'Abigail',
    lastName: 'Williams',
    email: 'abigail.williams@auramini.com',
    bio: 'Worship leader hoping to grow spiritually and academically through mentorship.',
  },
  {
    firstName: 'Elijah',
    lastName: 'Brown',
    email: 'elijah.brown@auramini.com',
    bio: 'Bi-vocational minister seeking guidance on balancing professional and ministerial duties.',
  }
];

async function main() {
  console.log('🌱 Adding 5 students...');

  const passwordHash = await bcrypt.hash('Student@12345', 12);

  for (const student of students) {
    const user = await prisma.user.upsert({
      where: { email: student.email },
      update: {
        role: 'STUDENT',
        passwordHash,
      },
      create: {
        email: student.email,
        passwordHash,
        role: 'STUDENT',
        profile: {
          create: {
            firstName: student.firstName,
            lastName: student.lastName,
            bio: student.bio,
          }
        }
      },
      include: { profile: true }
    });
    console.log(`✅ Registered Student: ${user.profile?.firstName} ${user.profile?.lastName} (${user.email})`);
  }

  console.log('🎉 5 students registered successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
