import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Store } from "./store.entity";

@Entity()
export class Coupon{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    code: string;

    @Column({type: 'enum', enum: ['FIXED','PERCENTAGE']})
    discountType: 'FIXED' | 'PERCENTAGE';

    @Column('decimal')
    discountValue: number;

    @Column( {type: 'enum', enum: ['PRODUCT','CATEGORY', 'FLAT']})
    scope: 'PRODUCT' | 'CATEGORY' | 'FLAT';

    @Column({nullable:true})
    productId: number;

    @Column({nullable:true})
    categoryId: number;

    @ManyToOne(()=> Store,(store)=> store.coupons)
    store: Store;

    @Column({type: 'timestamp', nullable: true})
    expiresAt?: Date 

    @CreateDateColumn()
    createdAt: Date;

}