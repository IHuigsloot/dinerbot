import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from "class-validator";

export class SendSensorDataDto {
    @ApiProperty()
    @IsNotEmpty()
    action: string;

    @ApiProperty()
    @IsOptional()
    temperature: number;

    @ApiProperty()
    @IsNotEmpty()
    ip: string;
}