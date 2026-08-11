import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const nigerianStates = ['Lagos', 'Abuja', 'Kano', 'Rivers', 'Oyo', 'Anambra', 'Enugu', 'Delta', 'Kaduna', 'Benue'];
const nigCities = ['Lagos Island', 'Ikeja', 'Port Harcourt', 'Ibadan', 'Onitsha', 'Enugu', 'Asaba', 'Kaduna', 'Makurdi', 'Abuja'];
const qualifications = ["High School Diploma", "Bachelor's Degree", "Master's Degree", "Doctorate", "Diploma in Theology"];
const ministryRoles = ['Senior Pastor', 'Associate Pastor', 'Youth Pastor', 'Worship Leader', 'Evangelist'];
const ministryFacilities = ['Rented Hall', 'Owned Building', 'House Church', 'School Auditorium', 'Tent'];
const ministryStatuses = ['Full-Time', 'Bi-Vocational'];
const testimonies = [
  "I encountered the Lord at a youth camp in 1998. The Holy Spirit overwhelmed me and I knew my life would never be the same. I gave my life to Christ and have not looked back since.",
  "Growing up in a broken home, I found peace in Jesus through a neighbour who shared the gospel. That night I accepted Christ and began my journey of faith.",
  "During a serious illness, I called on the name of Jesus and experienced a miraculous healing. Since then, I have dedicated my life to serving Him and sharing His goodness.",
  "I was radically transformed at a crusade meeting where the Word of God pierced my heart. I surrendered my life to Christ that evening and received the gift of salvation.",
  "After years of searching for meaning and purpose, a colleague invited me to a church service. That Sunday, I encountered the living God and my life was forever changed.",
];
const journeys = [
  "I began as a Sunday school teacher before moving into youth ministry. Over the years, God opened doors for me to pastor a small congregation, and I have been faithfully serving for over a decade.",
  "My ministry journey started at the age of 19 when I joined the choir. I was later called into full-time ministry after completing my theological studies and have been in pastoral leadership for 8 years.",
  "From ushering in my local assembly to pioneering a church plant, God has been faithful at every stage. I currently oversee a thriving congregation with active discipleship programmes.",
  "God called me into ministry through a prophetic word during a prayer retreat. Since then, I have been involved in evangelism, missions, and now lead a growing community church.",
  "After serving as an elder for several years, I was ordained and sent out to plant a new church. The ministry has grown significantly and we now have two branches.",
];
const visions = [
  "To raise a generation of Spirit-filled leaders who will transform their communities through the power of the Gospel and the demonstration of God's love.",
  "To build a discipleship-centred church that equips believers for effective ministry and extends the Kingdom of God to the unreached in our city and beyond.",
  "Our vision is to be a refuge for the broken, a training ground for ministers, and a light to our nation through consistent worship, the Word, and works of service.",
  "To establish a ministry network that supports pastors and churches across West Africa with resources, mentorship, and strategic mission partnerships.",
  "We are called to impact culture through the arts, media, and community outreach, making the Gospel relevant and accessible to every generation.",
];
const goals = [
  "Launch a structured discipleship programme for 50 new converts, ordain 2 deacons, and begin construction of a permanent church facility.",
  "Establish a mid-week Bible school, partner with at least 3 international ministries, and grow our congregation from 120 to 250 members.",
  "Complete theological training, publish my first ministry book, and conduct 4 regional evangelistic outreaches.",
  "Mentor 10 young ministers, open a second branch in an underserved community, and implement a robust welfare programme for members.",
  "Expand our online ministry reach to 10,000 followers, host a leadership conference, and support 5 mission trips to unreached areas.",
];
const challenges = [
  "The greatest challenge has been retaining young people in the church due to secular distractions and migration to urban centres.",
  "Financial sustainability for full-time ministry remains a major challenge as we depend entirely on tithes from a small congregation.",
  "Leadership succession and developing capable ministers to handle the growth of the ministry is our most pressing challenge.",
  "Balancing bi-vocational responsibilities while giving adequate pastoral attention to the needs of our congregation.",
  "Breaking cultural and traditional barriers that hinder complete surrender to the Gospel in our community.",
];
const whyCoverings = [
  "I am seeking a spiritual covering to provide accountability, wisdom, and the fatherly guidance needed to navigate the complexities of ministry leadership.",
  "After years of operating independently, I recognise the need for structured oversight and apostolic covering to help me grow and avoid pitfalls in ministry.",
  "I desire to be under a proven ministry that can mentor me, connect me to a broader network, and help me fulfil my God-given assignment more effectively.",
  "The Lord has been speaking to me about alignment and covering. I believe this mentorship is the next step in establishing a firm foundation for my ministry.",
  "I want to grow beyond my local context and the mentorship and network offered here represents the strategic connection I need.",
];
const fields = ["Theology", "Business Administration", "Education", "Engineering", "Social Sciences", "Mass Communication", "Law", "Medicine"];
const institutions = ["University of Lagos", "Covenant University", "University of Nigeria Nsukka", "Obafemi Awolowo University", "ECWA Theological Seminary", "Trinity Theological College"];
const focusAreas = ["Youth Ministry", "Evangelism & Outreach", "Discipleship", "Worship & Arts", "Community Development", "Missions", "Women Ministry", "Children Ministry"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randYear(min: number, max: number): string {
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

function randDate(startYear: number, endYear: number): string {
  const y = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  const m = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const d = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function generateOnboardingData(firstName: string, lastName: string, email: string) {
  const state = pick(nigerianStates);
  const city = pick(nigCities);
  const qual = pick(qualifications);
  const role = pick(ministryRoles);
  const facility = pick(ministryFacilities);
  const status = pick(ministryStatuses);
  const focusArea = pick(focusAreas);
  const field = pick(fields);
  const institution = pick(institutions);

  return {
    // Section 1: Personal
    fullName: `${firstName} ${lastName}`,
    preferredName: firstName,
    gender: Math.random() > 0.5 ? 'Male' : 'Female',
    dob: randDate(1965, 1990),
    nationality: 'Nigerian',
    birthCountry: 'Nigeria',
    originState: state,
    originLga: `${state} Central`,
    residenceCountry: 'Nigeria',
    residenceState: state,
    residenceCity: city,
    residenceLga: `${city} LGA`,
    residenceAddress: `${Math.floor(Math.random() * 200) + 1} Kingdom Avenue, ${city}`,
    mobileNumber: `080${Math.floor(Math.random() * 90000000) + 10000000}`,
    whatsAppNumber: `080${Math.floor(Math.random() * 90000000) + 10000000}`,
    emailAddress: email,
    socialMedia: `@${firstName.toLowerCase()}${lastName.toLowerCase()}`,

    // Section 2: Family
    maritalStatus: Math.random() > 0.4 ? 'Married' : 'Single',
    spouseName: `Grace ${lastName}`,
    weddingDate: randDate(2005, 2018),
    weddingLocation: `${city}, Nigeria`,
    numChildren: Math.floor(Math.random() * 4),
    childrenDetails: `Favour (12), Blessing (9), Emmanuel (6)`,

    // Section 3: Salvation
    salvationDate: randDate(1990, 2010),
    salvationTestimony: pick(testimonies),
    ministryCallDate: randDate(2000, 2015),
    ministryJourney: pick(journeys),

    // Section 4: Education
    highestQualification: qual,
    institutionAttended: institution,
    fieldOfStudy: field,
    certifications: `Certificate in Biblical Studies, ${pick(['RCCG School of Ministry', 'ECWA Bible School', 'Word of Faith Bible Institute'])}`,

    // Section 5: Ministry
    ministryName: `${pick(['Grace', 'Glory', 'Living Water', 'Redeemed', 'Faith', 'Power', 'Harvest', 'Kingdom'])} ${pick(['Chapel', 'Assembly', 'Ministries', 'International Church', 'Community Church'])}`,
    ministryWebsite: `www.${firstName.toLowerCase()}${pick(['ministries', 'chapel', 'church'])}.org`,
    ministryCountry: 'Nigeria',
    ministryState: state,
    ministryCity: city,
    ministryRole: role,
    ministryRoleOther: '',
    ministryStartYear: randYear(2005, 2018),
    ministryAvgAttendance: pick(['50-100', '100-250', '250-500', '500+']),
    ministryBranches: Math.floor(Math.random() * 4),
    ministryFacility: facility,
    ministryVision: pick(visions),
    ministryFocus: focusArea,
    ministryStatus: status,
    biVocationalProfession: status === 'Bi-Vocational' ? pick(['Teacher', 'Engineer', 'Medical Doctor', 'Lawyer', 'Accountant']) : '',

    // Section 6: Heritage
    heritageType: 'Senior Pastor',
    formerMinistry: `${pick(['Living Faith', 'RCCG', 'Deeper Life', 'Mountain of Fire'])} – ${state} Branch`,
    formerPastorName: `Bishop ${pick(['Emmanuel Adeyemi', 'Peter Okafor', 'Samuel Eze', 'David Oluwole'])}`,
    formerServiceYears: randYear(3, 10),
    formerResponsibilities: `Served as ${pick(['Youth Pastor', 'Associate Pastor', 'Worship Director', 'Cell Group Leader'])} with responsibility for ${pick(['youth discipleship', 'outreach programmes', 'worship coordination', 'small group leadership'])}`,
    ordained: 'Yes',
    released: 'Yes',
    releasedExplanation: 'Sent out by the leadership with blessings to pioneer a new congregation.',
    underSpiritualOversight: 'Yes',
    oversightDetails: `Currently under the apostolic oversight of ${pick(['Apostle James Nwosu', 'Bishop Grace Adeyemi', 'Dr. Faith Okonkwo'])} of ${pick(['Covenant Apostolic Ministry', 'Kingdom Builders Network', 'Ministers Fellowship International'])}.`,
    requestOversightFromDubus: 'Yes',
    activePastorName: '',
    activeMinistryName: '',
    activeServiceYears: '',
    activeResponsibilities: '',

    // Section 7: Vision & Growth
    goals12Months: pick(goals),
    greatestChallenge: pick(challenges),
    whySeekingCovering: pick(whyCoverings),
    expectedFromMentorship: `I expect to receive strategic mentorship, access to ministry resources, accountability structures, and connection with a network of like-minded ministers who are committed to Kingdom advancement.`,
    growthAreas: `${pick(['Preaching & Teaching', 'Church Administration', 'Pastoral Counselling', 'Leadership Development', 'Financial Management'])} and ${pick(['Evangelism Strategy', 'Discipleship Systems', 'Media & Communications', 'Mission & Outreach', 'Worship Leadership'])}`,

    // Section 8: Training Package
    trainingPackage: Math.random() > 0.5 ? 'Spiritual Fatherhood' : 'Mentorship',
  };
}

async function main() {
  console.log('🌱 Auto-filling onboarding details for all users...\n');

  const users = await prisma.user.findMany({
    include: { profile: true, onboardingDetails: true },
  });

  let seeded = 0;
  let skipped = 0;
  let alreadyHad = 0;

  for (const user of users) {
    // Skip admin roles — they don't need onboarding
    if (user.role === 'ADMINISTRATOR') {
      console.log(`⏭️  Skipping ${user.email} — admin user.`);
      skipped++;
      continue;
    }

    const firstName = user.profile?.firstName || 'Minister';
    const lastName = user.profile?.lastName || 'Servant';

    // Check if existing data already has trainingPackage — skip if so (preserve real submissions)
    if (user.onboardingDetails) {
      try {
        const existing = JSON.parse(user.onboardingDetails.data);
        if (existing.trainingPackage) {
          console.log(`⏭️  Skipping ${user.email} — already has trainingPackage: ${existing.trainingPackage}`);
          alreadyHad++;
          continue;
        }
      } catch { /* parse error, will regenerate */ }
    }

    const data = generateOnboardingData(firstName, lastName, user.email);

    await prisma.onboardingDetails.upsert({
      where: { userId: user.id },
      update: { data: JSON.stringify(data) },
      create: { userId: user.id, data: JSON.stringify(data) },
    });

    console.log(`✅ Seeded/Updated: ${firstName} ${lastName} (${user.email}) → ${data.trainingPackage}`);
    seeded++;
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Seeded:      ${seeded} users`);
  console.log(`   ⏭️  Skipped:     ${skipped} admin users`);
  console.log(`   📋 Had already: ${alreadyHad} users`);
  console.log(`\n🎉 Done! All applicable users now have onboarding details.`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
