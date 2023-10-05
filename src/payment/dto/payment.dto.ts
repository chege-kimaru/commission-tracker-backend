import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

abstract class PaymentDto {
    @ApiProperty()
    @IsNotEmpty()
    paidOn: Date;

    @ApiProperty()
    @IsNotEmpty()
    amount: number;
}

export class CreatePaymentDto extends PaymentDto { 
    @ApiProperty()
    @IsNotEmpty()
    investmentId: string;
}

export class UpdatePaymentDto extends PaymentDto { }