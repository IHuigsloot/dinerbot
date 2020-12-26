import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Restaurant } from 'src/restaurants/schemas/restaurant.schema';
import { Status } from '../status';

export type OrderDocument = Order & mongoose.Document;

@Schema()
export class Order {
  @Prop()
  user: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    autopopulate: true,
  })
  restaurant: Restaurant;

  @Prop({
    default: 'created',
  })
  status: Status;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
