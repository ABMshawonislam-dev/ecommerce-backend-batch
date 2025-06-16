import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entity/product.entity';
import { Review } from 'src/entity/review.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Product)
        private productRepository: Repository<User>,
    ){}

    async create(createReviewDto: CreateReviewDto, userId: number): Promise<Review>{
        const {productId,...reviewData} = createReviewDto
        const user = await this.userRepository.findOne({where: {id: userId}})

        if(!user){
            throw new NotFoundException("User Not Found")
        }

        const product = await this.productRepository.findOne({where: {id:productId }})

        if(!product){
            throw new NotFoundException("Product Not Found")
        }


        const review = this.reviewRepository.create({
            ...reviewData,
            user,
            product,
            createdAt: new Date()
        })

        return this.reviewRepository.save(review)

    }

}

// update review, jekono akta product er id upor base kore review show korben, review delete
