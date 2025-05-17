import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entity/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private  productRepository: Repository<Product>,
    ) {}


    async createProduct(createProductDto: CreateProductDto): Promise<Product> {
        const product = this.productRepository.create(createProductDto);
        return this.productRepository.save(product);
    }

    async getAllProducts(): Promise<Product[]> {
        return this.productRepository.find();
    }

    async getProductById(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id: Number(id) } });
        if(!product) {
            throw new Error('Product not found');
        }

        return product;
    }

    async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id } });
        if(!product) {
            throw new Error('Product not found');
        }
        Object.assign(product, updateProductDto);
        return this.productRepository.save(product);
    }

}
