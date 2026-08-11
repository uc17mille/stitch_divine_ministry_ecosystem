import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const rows = await p.onboardingDetails.findMany({ take: 20 });
rows.forEach(x => {
  try {
    const d = JSON.parse(x.data);
    console.log('userId:', x.userId, '| trainingPackage:', d.trainingPackage ?? 'NOT SET');
  } catch { console.log('parse error for', x.userId); }
});
await p.$disconnect();
