import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import * as mongoose from 'mongoose';
import { Restaurant } from 'src/restaurants/schemas/restaurant.schema';

export type OrderDocument = Order & mongoose.Document;
@Schema({
  timestamps: true,
})
export class Order {
  @Prop()
  user: string;

  @Prop()
  name: string;

  @Prop()
  destination: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    autopopulate: true,
  })
  restaurant: Restaurant;

  @Prop({
    required: true,
  })
  products: OrderProduct[];

  @Prop({
    default: 'created',
  })
  status: string;

  @Prop()
  temperatureHistory: any[];

  @Prop()
  preperationTime: number;

  @Prop()
  path: any[];

}

export const OrderSchema = SchemaFactory.createForClass(Order);

export class OrderProduct {
  @Expose()
  name: string;

  @Expose()
  quantity: number;

  @Expose()
  price: number;

  @Expose()
  preperationTime: number;

  @Expose()
  _id: string;
}
