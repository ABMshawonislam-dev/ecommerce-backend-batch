import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ImageService } from './image.service';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage,File } from 'multer';
import { UploadImageDto } from './dto/upload-image.dto';


@ApiTags('image')
@Controller('image')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @Post('upload')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Upload an image' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'The image to upload',
        type: UploadImageDto,
    })
    @ApiResponse({ status: 201, description: 'Image uploaded successfully',type:Object })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
        @UseInterceptors(
            FileInterceptor('file', {
                storage: diskStorage({
                        destination: './uploads',
                        filename: (req, file, cb) => {
                            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                            const ext = extname(file.originalname);
                            cb(null, file.fieldname + '-' + uniqueSuffix + ext);
                        }
                }),
                fileFilter: (req, file, cb) => {
                    const allowedTypes = /jpeg|jpg|png/;
                    const fileExt = extname(file.originalname).toLowerCase();
                    const extIsValid = allowedTypes.test(fileExt);
                    const mimetypeIsValid = allowedTypes.test(file.mimetype);
                    if (mimetypeIsValid && extIsValid) {
                        return cb(null, true); 
                    }
                    cb(new Error('Invalid file type. Only JPEG, JPG, and PNG files are allowed.'),false);
                }
            }),
        )
    async uploadImage(@UploadedFile() file: File) {
        return this.imageService.uploadImage(file);
        
    }
}
