import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { EventsService } from './events.service';
import { CreateEventDto } from './events.dto';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get() findAll() { return this.eventsService.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.eventsService.findOne(id); }

  @ApiBearerAuth() @UseGuards(AuthGuard('jwt'))
  @Post() create(@Body() dto: CreateEventDto) { return this.eventsService.create(dto); }

  @ApiBearerAuth() @UseGuards(AuthGuard('jwt'))
  @Post(':id/register')
  register(@Param('id') id: string, @Request() req: any) {
    return this.eventsService.register(id, req.user.userId);
  }

  @ApiBearerAuth() @UseGuards(AuthGuard('jwt'))
  @Get('my/registrations')
  getMyRegistrations(@Request() req: any) {
    return this.eventsService.getMyRegistrations(req.user.userId);
  }
}
