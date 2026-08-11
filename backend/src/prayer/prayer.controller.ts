import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PrayerService } from './prayer.service';
import { CreatePrayerRequestDto, CreatePrayerCategoryDto } from './prayer.dto';

@ApiTags('prayer')
@Controller('prayer')
export class PrayerController {
  constructor(private prayerService: PrayerService) {}

  @Get('categories')
  getCategories() { return this.prayerService.getCategories(); }

  @ApiBearerAuth() @UseGuards(AuthGuard('jwt'))
  @Post('categories')
  createCategory(@Body() dto: CreatePrayerCategoryDto) { return this.prayerService.createCategory(dto); }

  @ApiBearerAuth() @UseGuards(AuthGuard('jwt'))
  @Get()
  getRequests(@Request() req: any) { return this.prayerService.getRequests(req.user.userId); }

  @ApiBearerAuth() @UseGuards(AuthGuard('jwt'))
  @Post()
  createRequest(@Request() req: any, @Body() dto: CreatePrayerRequestDto) {
    return this.prayerService.createRequest(req.user.userId, dto);
  }

  @ApiBearerAuth() @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteRequest(@Param('id') id: string, @Request() req: any) {
    return this.prayerService.deleteRequest(id, req.user.userId);
  }
}
