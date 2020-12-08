import { IsNotEmpty } from 'class-validator';
export class CreateRestaurantDto {
  @IsNotEmpty()
  readonly name: string;

  readonly tags: string[];

  image: string;
}
