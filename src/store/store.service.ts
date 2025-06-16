import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/entity/store.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Product } from 'src/entity/product.entity';

@Injectable()
export class StoreService {
    constructor(
        @InjectRepository(Store)
        private readonly storeRepository: Repository<Store>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

    ) {}


    async create(createStoreDto: CreateStoreDto, userId: number): Promise<Store> {
        const user = await this.userRepository.findOne({where: { id: userId }});
        if (!user) {
            throw new Error('User not found');
        }

        const store = this.storeRepository.create({
            ...createStoreDto,
            owner: user,
            createdAt: new Date(),
        });
        return this.storeRepository.save(store);

    }

    async getAll(): Promise<any[]> {
        const stores = await this.storeRepository.find({ relations: ['owner', 'product', 'product.reviews'] });

        return Promise.all(
            stores.map(async (store)=>{
                const averageRating = await this.calculateStoreReview(store.id)
                return {...store,averageRating}
            })
        )

    }

    async getStoreById(id: number): Promise<Store>{
        const store = await this.storeRepository.findOne({where: { id }, relations: ['owner']});
        if (!store) {
            throw new Error('Store not found');
        }
        return store;
    }

    async update(id: number, updateStoreDto: UpdateStoreDto, userId: number): Promise<Store>{
        const store = await this.storeRepository.findOne({where: { id }, relations: ['owner']});
        if (!store) {
            throw new Error('Store not found');
        }
        if( store.owner.id !== userId) {
            throw new Error('You are not authorized to update this store');
        }
        const updatedStore = Object.assign(store, updateStoreDto);
        return this.storeRepository.save(updatedStore);
    }


    private async calculateStoreReview(storeId: number){
        const product = await this.productRepository.find({
            where: {store: {id: storeId}},
            relations: ['reviews'],
        })

        const allRatings = product.flatMap((product)=>product.reviews.map((review)=> review.rating))

        if( allRatings.length === 0){
            return 0
        }

        const average = allRatings.reduce((sum,rating)=> sum + rating, 0) / allRatings.length
        return average.toFixed(2)

    }

// ========= 
}
