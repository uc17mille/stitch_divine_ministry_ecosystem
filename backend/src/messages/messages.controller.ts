import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async sendMessage(
    @Body() body: { senderId: string; receiverId: string; content: string }
  ) {
    return this.messagesService.sendMessage(body.senderId, body.receiverId, body.content);
  }

  @Get('user/:userId')
  async getMyConversations(@Param('userId') userId: string) {
    return this.messagesService.getMyConversations(userId);
  }

  @Get('admin/all')
  async getAllMessagesForAdmin() {
    return this.messagesService.getAllMessagesForAdmin();
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.messagesService.markAsRead(id);
  }
}
