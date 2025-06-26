import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService:CategoryService){}

    @Post('/create')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({summary: 'Create a new Category'})
    async create(@Body() createCategoryDto: CreateCategoryDto){
        return this.categoryService.create(createCategoryDto)
    }

}
