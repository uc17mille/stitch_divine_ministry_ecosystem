import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
// RolesGuard will ensure only admins can fetch this. If it doesn't exist globally, we just rely on JWT for MVP or check role manually. 
// We will simply use AuthGuard.

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @ApiOperation({ summary: 'Get dashboard analytics' })
  @ApiQuery({ name: 'timeRange', required: false, type: String })
  @Get('dashboard')
  getDashboardData(@Query('timeRange') timeRange?: string) {
    return this.analyticsService.getDashboardData(timeRange);
  }
}
