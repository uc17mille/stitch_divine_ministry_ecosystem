import { IsString, IsOptional, IsUUID, IsNumber, IsUrl, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class NestedLessonDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() content?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() videoUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() audioUrl?: string;
}

export class NestedModuleDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  
  @ApiProperty({ type: [NestedLessonDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NestedLessonDto)
  lessons?: NestedLessonDto[];
}

export class CreateCourseDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() description: string;
  @ApiPropertyOptional() @IsOptional() @IsUrl() thumbnailUrl?: string;
  @ApiProperty() @IsUUID() categoryId: string;
  @ApiPropertyOptional() @IsOptional() @IsString() format?: string; // 'VIDEO', 'AUDIO', 'BOTH'

  @ApiProperty({ type: [NestedModuleDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NestedModuleDto)
  modules?: NestedModuleDto[];
}

export class CreateModuleDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsUUID() courseId: string;
  @ApiProperty() @IsNumber() orderIndex: number;
}

export class CreateLessonDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() content?: string;
  @ApiProperty() @IsUUID() moduleId: string;
  @ApiProperty() @IsNumber() orderIndex: number;
}

export class CreateEnrollmentDto {
  @ApiProperty() @IsUUID() courseId: string;
}

export class UpdateLessonProgressDto {
  @ApiProperty() @IsUUID() lessonId: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() lastPosition?: number;
}
