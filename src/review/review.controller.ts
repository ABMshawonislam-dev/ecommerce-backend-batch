import { Body, Controller, Post, UseGuards,Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';


@ApiTags("reviews")
@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Post('/create/review')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Create a new review for product"})
    @ApiResponse({ status: 201, description: "Review created successfully" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "Product not found" })
    async create(@Body() createReviewDto: CreateReviewDto, @Request() req){
        return this.reviewService.create(createReviewDto, req.user.id)
    }

}
