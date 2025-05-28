import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entity/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from 'src/entity/user.entity';
import { Store } from 'src/entity/store.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private  productRepository: Repository<Product>,
        @InjectRepository(User)
        private  userRepository: Repository<User>,
        @InjectRepository(Store)
        private  storeRepository: Repository<Store>,

    ) {}


    async createProduct(createProductDto: CreateProductDto, userId: number): Promise<Product> {
        const {storeId, ...productData} = createProductDto;
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        const store = await this.storeRepository.findOne({where: {id: storeId, owner: { id: userId } }});
        if (!store) {
            throw new Error('Store not found or you are not the owner');
        }
        const product = this.productRepository.create({
            ...productData,
            vendor: user,
            store
        });
        return this.productRepository.save(product);
    }

    async getAllProducts(): Promise<Product[]> {
        return this.productRepository.find({relations: ['vendor', 'store']});
    }

    async getProductById(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id: Number(id) },relations: ['vendor', 'store'] });
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

    async deleteProduct(id: number): Promise<void> {
        const product = await this.productRepository.findOne({ where: { id } });
        if(!product) {
            throw new Error('Product not found');
        }
        await this.productRepository.remove(product);
    }

}
