import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty() @IsString() content: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() groupId?: string;
}

export class CreateCommentDto {
  @ApiProperty() @IsString() content: string;
  @ApiProperty() @IsUUID() postId: string;
}

export class CreateGroupDto {
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
}
