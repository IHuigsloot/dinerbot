import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type RobotDocument = Robot & Document;

@Schema()
export class Robot {
    @Prop({ required: true })
    name: string;

    @Prop()
    ip: string

    @Prop()
    currentLocation:  string;

    @Prop({
        default: false,
    })
    active: boolean;
}

export const RobotSchema = SchemaFactory.createForClass(Robot);

