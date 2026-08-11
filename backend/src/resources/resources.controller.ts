import { Controller, Get, Post, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ResourcesService } from './resources.service';

@ApiTags('resources')
@Controller('resources')
export class ResourcesController {
  constructor(private resourcesService: ResourcesService) {}

  @Get() findAll(@Query('search') search?: string) { return this.resourcesService.findAll(search); }

  @ApiBearerAuth() @UseGuards(AuthGuard('jwt'))
  @Post() create(@Body() body: { title: string; description?: string; url: string }) { return this.resourcesService.create(body); }

  @ApiBearerAuth() @UseGuards(AuthGuard('jwt'))
  @Post(':id/download')
  download(@Param('id') id: string, @Request() req: any) { return this.resourcesService.recordDownload(req.user.userId, id); }
}
