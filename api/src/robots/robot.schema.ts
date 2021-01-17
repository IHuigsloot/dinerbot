import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RobotDocument = Robot & Document;

@Schema()
export class Robot {
    @Prop({
        required: true,
    })
    ip : string

    @Prop()
    location:  string;

    @Prop()
    direction:  number;

    @Prop({
        default: null,
    })
    currentOrder: string;
}

export const RobotSchema = SchemaFactory.createForClass(Robot);

