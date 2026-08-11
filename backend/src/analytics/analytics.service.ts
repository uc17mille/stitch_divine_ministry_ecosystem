import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData(timeRange?: string) {
    let dateFilter: any = undefined;
    
    if (timeRange && timeRange !== 'all') {
      const days = parseInt(timeRange, 10);
      if (!isNaN(days)) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        dateFilter = { gte: date };
      }
    }

    // Helper for where clauses
    const whereCreatedAt = dateFilter ? { createdAt: dateFilter } : undefined;
    const whereEnrolledAt = dateFilter ? { enrolledAt: dateFilter } : undefined;

    // --- 1. KPI Queries ---
    
    // Total Users
    const totalUsers = await this.prisma.user.count({ where: whereCreatedAt });

    // Active Enrollments
    const activeEnrollments = await this.prisma.enrollment.count({
      where: { 
        status: 'ACTIVE',
        ...(dateFilter ? { enrolledAt: dateFilter } : {})
      }
    });

    // Completion Rate
    const totalEnrollments = await this.prisma.enrollment.count({
      where: whereEnrolledAt
    });
    const completedEnrollments = await this.prisma.enrollment.count({
      where: { 
        status: 'COMPLETED',
        ...(dateFilter ? { enrolledAt: dateFilter } : {})
      }
    });
    const completionRate = totalEnrollments > 0 
      ? Math.round((completedEnrollments / totalEnrollments) * 100) 
      : 0;

    // Revenue / Donations
    const paymentsAggr = await this.prisma.payment.aggregate({ 
      _sum: { amount: true }, 
      where: { 
        status: 'COMPLETED',
        ...(dateFilter ? { createdAt: dateFilter } : {})
      } 
    });
    const donationsAggr = await this.prisma.donation.aggregate({ 
      _sum: { amount: true },
      where: whereCreatedAt
    });
    // Total Courses
    const totalCourses = await this.prisma.course.count();

    // --- 2. Ministry Impact Queries ---

    const activePrayerRequests = await this.prisma.prayerRequest.count({ where: whereCreatedAt });
    const mentorshipBookings = await this.prisma.booking.count({
      where: { 
        status: 'SCHEDULED',
        ...(dateFilter ? { createdAt: dateFilter } : {})
      }
    });
    const communityPosts = await this.prisma.communityPost.count({ where: whereCreatedAt });

    // --- 3. Top Courses Leaderboard ---
    const topCourses = await this.prisma.course.findMany({
      take: 4,
      orderBy: {
        enrollments: { _count: 'desc' }
      },
      include: {
        category: true,
        _count: { select: { enrollments: true } }
      }
    });

    // --- 4. Existing Visualizations ---

    // Retention Curve (Simulated logically for MVP)
    const retention = [
      { label: 'Start (Intro)', val: '100%', h: '100%', color: 'bg-blue-600' },
      { label: 'Module 1', val: '88%', h: '88%', color: 'bg-blue-500' },
      { label: 'Module 2', val: '72%', h: '72%', color: 'bg-blue-400' },
      { label: 'Module 3', val: '45%', h: '45%', color: 'bg-rose-400' },
      { label: 'Completion', val: '40%', h: '40%', color: 'bg-blue-200' },
    ];

    // Platform Usage
    const platformUsage = {
      mobile: 62,
      desktop: 38
    };

    // Live Feed (Aggregate latest signups and enrollments)
    const latestUsers = await this.prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      where: whereCreatedAt,
      include: { profile: true }
    });

    const latestEnrollmentsLog = await this.prisma.enrollment.findMany({
      take: 5,
      orderBy: { enrolledAt: 'desc' },
      where: whereEnrolledAt,
      include: { user: { include: { profile: true } }, course: true }
    });

    const liveFeed: any[] = [];

    for (const u of latestUsers) {
      liveFeed.push({
        type: 'signup',
        msg: `${u.profile?.firstName || 'A user'} joined the platform.`,
        date: u.createdAt,
      });
    }

    for (const e of latestEnrollmentsLog) {
      liveFeed.push({
        type: 'enrollment',
        msg: `${e.user?.profile?.firstName || 'A user'} enrolled in "${e.course?.title}".`,
        date: e.enrolledAt,
      });
    }

    // Sort by date descending
    liveFeed.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Heatmap data (Simulated logical data)
    const heatmap = [
      { day: 'Mon', active: [20, 30, 80, 50, 40, 60, 20] },
      { day: 'Tue', active: [10, 40, 90, 60, 50, 50, 30] },
      { day: 'Wed', active: [15, 35, 70, 40, 30, 45, 25] },
      { day: 'Thu', active: [25, 45, 85, 55, 60, 70, 40] },
      { day: 'Fri', active: [30, 50, 95, 80, 70, 90, 60] },
      { day: 'Sat', active: [40, 70, 110, 100, 90, 100, 80] },
      { day: 'Sun', active: [50, 80, 120, 110, 100, 110, 90] },
    ];

    return {
      kpis: {
        totalUsers,
        activeCourses: totalCourses,
        activePrayerRequests,
        activeEnrollments,
        completionRate,
        totalRevenue: (paymentsAggr._sum.amount || 0) + (donationsAggr._sum.amount || 0)
      },
      ministryImpact: {
        activePrayerRequests,
        mentorshipBookings,
        communityPosts
      },
      topCourses: topCourses.map(c => ({
        id: c.id,
        title: c.title,
        category: c.category.name,
        enrollments: c._count.enrollments
      })),
      retention,
      platformUsage,
      liveFeed: liveFeed.slice(0, 8),
      heatmap
    };
  }
}
