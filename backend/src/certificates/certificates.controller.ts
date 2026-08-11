import { Controller, Get, Post, Body, Param, Put, Delete, UseInterceptors, UploadedFile, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { CertificatesService } from './certificates.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('certificates')
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get('templates')
  @ApiOperation({ summary: 'Get all certificate templates' })
  getTemplates() {
    return this.certificatesService.getTemplates();
  }

  @Post('templates')
  @ApiOperation({ summary: 'Create a new certificate template' })
  createTemplate(@Body() data: any) {
    return this.certificatesService.createTemplate(data);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload a certificate background template' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/certificates',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  uploadTemplateBackground(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    // Return the URL to be used as backgroundUrl
    return { url: `/uploads/certificates/${file.filename}` };
  }

  @Get('issued')
  @ApiOperation({ summary: 'Get all issued certificates (Ledger)' })
  getIssuedCertificates() {
    return this.certificatesService.getIssuedCertificates();
  }

  @Post('generate/:courseId/:userId')
  @ApiOperation({ summary: 'Generate and send a certificate for a user (Simulation)' })
  generateCertificate(@Param('courseId') courseId: string, @Param('userId') userId: string) {
    return this.certificatesService.generateCertificate(courseId, userId);
  }
}
