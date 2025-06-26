import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateProductDto {
    @ApiProperty({description: 'Product name', example: 'Product A'})
    @IsString()
    @IsOptional()
    name: string;

    @ApiProperty({description: 'Product description', example: 'Description of Product A'})
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty({description: 'Product price', example: 100})
    @IsNumber()
    @IsOptional()
    price: number;

    @ApiProperty({description: 'Product stock', example: 50})
    @IsNumber()
    @IsOptional()
    stock: number;

    @ApiProperty({description: 'Store ID', example: 1})
    @IsNotEmpty()
    @IsNumber()
    storeId: number;

    @ApiProperty({description: 'Category ID', example: 1})
    @IsNotEmpty()
    @IsNumber()
    categoryId: number;

}