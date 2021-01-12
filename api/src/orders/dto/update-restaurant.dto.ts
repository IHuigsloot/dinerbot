import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Status, StatusEnum } from '../status';

export class UpdateOrderDto {
  @ApiProperty({ enum: StatusEnum, enumName: 'Status' })
  @IsNotEmpty()
  @IsEnum(StatusEnum)
  readonly status: string;
}
