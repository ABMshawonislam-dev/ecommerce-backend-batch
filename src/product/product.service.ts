import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entity/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from 'src/entity/user.entity';
import { Store } from 'src/entity/store.entity';
import { Category } from 'src/entity/category.entity';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private  productRepository: Repository<Product>,
        @InjectRepository(User)
        private  userRepository: Repository<User>,
        @InjectRepository(Store)
        private  storeRepository: Repository<Store>,
        @InjectRepository(Category)
        private  categoryRepository: Repository<Category>,

    ) {}


    async createProduct(createProductDto: CreateProductDto, userId: number): Promise<Product> {
        const {storeId,categoryId, ...productData} = createProductDto;
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        const store = await this.storeRepository.findOne({where: {id: storeId, owner: { id: userId } }});
        if (!store) {
            throw new Error('Store not found or you are not the owner');
        }

        const category = await this.categoryRepository.findOne({where:{id: categoryId}})

        if(!category){
            throw new NotFoundException("Category not found")
        }

        const product = this.productRepository.create({
            ...productData,
            vendor: user,
            store,
            category
        });
        return this.productRepository.save(product);
    }

    async getAllProducts(): Promise<Product[]> {
        return this.productRepository.find({relations: ['vendor', 'store','category','review']});
    }

    async getProductById(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id: Number(id) },relations: ['vendor', 'store','category','review'] });
        if(!product) {
            throw new Error('Product not found');
        }

        return product;
    }

    async updateProduct(id: number, updateProductDto: UpdateProductDto, userId: number): Promise<Product> {
        
        const product = await this.productRepository.findOne({ where: { id } });

         if(!product) {
            throw new Error('Product not found');
        }

        if(product?.vendor.id !== userId){
            throw new ForbiddenException("You are not authorized to update this product")
        }

        if(updateProductDto.storeId){
            const store = await this.storeRepository.findOne({where: {id: updateProductDto.storeId, owner: {id: userId}}})

            if(!store){
                throw new ForbiddenException("Sotre not found or you are not the owner")
            }

            product.store = store
        }

        if(updateProductDto.categoryId){
            const category = await this.categoryRepository.findOne({where: {id: updateProductDto.categoryId}})
            if(!category){
                throw new NotFoundException("Category not found")
            }

            product.category = category

        }

       
        Object.assign(product, updateProductDto);
        return this.productRepository.save(product);
    }

    async deleteProduct(id: number): Promise<void> {
        const product = await this.productRepository.findOne({ where: { id } });
        if(!product) {
            throw new Error('Product not found');
        }
        await this.productRepository.remove(product);
    }

}
