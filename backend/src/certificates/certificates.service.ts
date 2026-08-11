import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CertificatesService {
  constructor(private readonly prisma: PrismaService) {}

  async getTemplates() {
    return this.prisma.certificateTemplate.findMany({
      include: { course: true }
    });
  }

  async createTemplate(data: { name: string, courseId: string, backgroundUrl: string, mappingConfig?: string }) {
    // Check if course exists
    const course = await this.prisma.course.findUnique({ where: { id: data.courseId } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if template already exists for course
    const existing = await this.prisma.certificateTemplate.findUnique({ where: { courseId: data.courseId } });
    if (existing) {
      return this.prisma.certificateTemplate.update({
        where: { id: existing.id },
        data: { name: data.name, backgroundUrl: data.backgroundUrl, mappingConfig: data.mappingConfig }
      });
    }

    return this.prisma.certificateTemplate.create({
      data: {
        name: data.name,
        courseId: data.courseId,
        backgroundUrl: data.backgroundUrl,
        mappingConfig: data.mappingConfig
      }
    });
  }

  async getIssuedCertificates() {
    return this.prisma.certificate.findMany({
      include: {
        user: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
        course: { select: { id: true, title: true } },
        template: { select: { id: true, name: true } }
      },
      orderBy: { issuedAt: 'desc' }
    });
  }

  async generateCertificate(courseId: string, userId: string) {
    // 1. Find the template
    const template = await this.prisma.certificateTemplate.findUnique({ where: { courseId } });
    if (!template) {
      throw new BadRequestException('No certificate template configured for this course');
    }

    // 2. Find the user
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { profile: true } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 3. Generate Unique Code
    const verificationCode = `LUM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // 4. Create DB Entry
    const cert = await this.prisma.certificate.create({
      data: {
        userId,
        courseId,
        templateId: template.id,
        verificationCode,
        pdfUrl: `/api/certificates/download/${verificationCode}`, // Future PDF endpoint
      }
    });

    // 5. Simulate Email Sending
    console.log(`[Email Service] Simulated sending Certificate ${cert.verificationCode} to ${user.email}`);

    return cert;
  }
}
