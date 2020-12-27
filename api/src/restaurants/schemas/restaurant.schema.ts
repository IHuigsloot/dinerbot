import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RestaurantDocument = Restaurant & Document;
@Schema()
export class Restaurant {
  @Prop({ required: true })
  name: string;

  @Prop([String])
  tags: string[];

  @Prop({
    select: false,
  })
  image: string;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
