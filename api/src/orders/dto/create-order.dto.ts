import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { Product } from 'src/restaurants/products/product.schema';

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly restaurant: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  products: string[] | Product[];
}
