import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly restaurant: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly destination: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductObject)
  products: ProductObject[];
}

class ProductObject {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  quantity = 0;
}
