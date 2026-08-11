import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { PrayerModule } from './prayer/prayer.module';
import { EventsModule } from './events/events.module';
import { CommunityModule } from './community/community.module';
import { MentorshipModule } from './mentorship/mentorship.module';
import { ResourcesModule } from './resources/resources.module';
import { UsersModule } from './users/users.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { CertificatesModule } from './certificates/certificates.module';
import { SettingsModule } from './settings/settings.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    CoursesModule,
    PrayerModule,
    EventsModule,
    CommunityModule,
    MentorshipModule,
    ResourcesModule,
    UsersModule,
    AnalyticsModule,
    CertificatesModule,
    SettingsModule,
    MessagesModule,
  ],
})
export class AppModule {}
