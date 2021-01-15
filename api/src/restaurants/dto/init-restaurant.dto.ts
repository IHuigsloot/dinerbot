import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class InitRestaurantDto {
  @ApiProperty()
  @IsNotEmpty()
  ip: string;

  @ApiProperty()
  @IsNotEmpty()
  restaurant: string;
}
