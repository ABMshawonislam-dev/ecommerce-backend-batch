import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export  class CreateProductDto {
    @ApiProperty({ description: 'Product name', example: 'Product A' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Product description', example: 'Description of Product A' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: 'Product price', example: 100 })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ description: 'Product stock', example: 50 })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
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