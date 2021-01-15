import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class InitRobotDto {
  @ApiProperty()
  @IsOptional()
  ip: string;

  @ApiProperty()
  @IsOptional()
  location: string;
}
