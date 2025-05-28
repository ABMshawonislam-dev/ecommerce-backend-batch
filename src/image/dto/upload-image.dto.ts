import { ApiProperty } from "@nestjs/swagger";
import { diskStorage,File } from 'multer';
export class UploadImageDto {
    @ApiProperty({
        description: 'The image to upload',
        type: 'string',
        format: 'binary',
    })
    file: File;
}