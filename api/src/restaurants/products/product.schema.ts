import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Restaurant } from '../schemas/restaurant.schema';

export type ProductDocument = Product & Document;
@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  })
  restaurant: Restaurant | string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
