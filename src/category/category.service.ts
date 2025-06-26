import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entity/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>
    ){}

    async create(createCategoryDto: CreateCategoryDto): Promise<Category>{
        const category = this.categoryRepository.create(createCategoryDto)
        return this.categoryRepository.save(category)
    }

}

// update category, jekono akta product er id upor base kore category show korben, category delete
