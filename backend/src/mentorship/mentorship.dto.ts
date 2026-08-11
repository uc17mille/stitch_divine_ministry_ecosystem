import { IsString, IsOptional, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTrackDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() description: string;
}

export class CreateBookingDto {
  @ApiProperty() @IsUUID() trackId: string;
  @ApiProperty() @IsUUID() mentorId: string;
  @ApiProperty() @IsDateString() startTime: string;
  @ApiProperty() @IsDateString() endTime: string;
}
