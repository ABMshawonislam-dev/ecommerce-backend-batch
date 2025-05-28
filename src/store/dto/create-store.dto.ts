import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class CreateStoreDto {
    @ApiProperty({
        description: 'Name of the store',
        example: 'My Awesome Store',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Description of the store',
        example: 'This is a store that sells awesome products.',
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        description: 'Store Image Url',
        example: "https://example.com/store-image.jpg",
        required: false,
    })
    @IsString()
    imageUrl?: string;
}