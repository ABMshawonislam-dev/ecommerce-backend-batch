import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto{
    @ApiProperty({description: "Category Name", example: "Electronics"})
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({description: "Category Description", example: "Gadgets and devices"})
    @IsString()
    @IsOptional()
    description: string
}