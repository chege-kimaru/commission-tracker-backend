import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

abstract class InvestmentDto {
    @ApiProperty()
    @IsNotEmpty()
    project: string;

    @ApiProperty()
    @IsNotEmpty()
    typology: string;

    @ApiProperty()
    @IsNotEmpty()
    unitNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    commissionPercentage: number;
    
    @ApiProperty()
    @IsNotEmpty()
    price: number;
}

export class CreateInvestmentDto extends InvestmentDto { 
    @ApiProperty()
    @IsNotEmpty()
    investorId: string;
}

export class UpdateInvestmentDto extends InvestmentDto { }