import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { ProductModule } from './product/product.module';
import { Product } from './entity/product.entity';
import { ImageModule } from './image/image.module';
import { StoreModule } from './store/store.module';
import { ReviewModule } from './review/review.module';
import { Review } from './entity/review.entity';
import { Store } from './entity/store.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123Shawon123',
      database: 'postgres',
      entities: [User,Product,Store,Review],
      synchronize: true, // Set to false in production
    }),
    AuthModule,
    ProductModule,
    ImageModule,
    StoreModule,
    ReviewModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
