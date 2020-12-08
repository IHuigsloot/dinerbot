import { Exclude } from 'class-transformer';

export class RestaurantEntity {
  _id: number;
  name: string;
  tags: string[];

  @Exclude()
  __v: string;

  @Exclude()
  image: string;

  constructor(partial: Partial<RestaurantEntity>) {
    Object.assign(this, partial);
  }
}
