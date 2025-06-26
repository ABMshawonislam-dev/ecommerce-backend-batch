import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateCouponDto{
    @ApiProperty({description: "Unique coupon code", example: "ONEYEAR50"})
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({description: "Disount Type", example: "PERCENTAGE",enum:["FIXED","PERCENTAGE"]})
    @IsEnum(["FIXED","PERCENTAGE"])
    discountType: "FIXED" | "PERCENTAGE";

    @ApiProperty({description: "Disount value (amout for FIXED, percentage for PERCENTAGE)", example: "20"})
    @IsNumber()
    @Min(0)
    discountValue: number;

    @ApiProperty({description: "Coupon Scope", example: "PRODUCT ",enum:["PRODUCT","CATEGORY","FLAT"]}) 
    @IsEnum(["PRODUCT","CATEGORY","FLAT"])
    scope: "PRODUCT" | "CATEGORY" | "FLAT";

    @ApiProperty({description: "Store Id", example: 1})
    @IsInt()
    @IsNotEmpty()
    storeId: number;

    @ApiProperty({description: "Product Id", example: 1})
    @IsInt()
    @IsOptional()
    productId: number;

    @ApiProperty({description: "Category Id", example: 1})
    @IsInt()
    @IsOptional()
    categoryId: number;

    @ApiProperty({description: "Expiration date (ISO format)", example: "2025-12-31T22:59:59.000Z", required: false})
    @IsDateString()
    @IsOptional()
    expiresAt?: string
}