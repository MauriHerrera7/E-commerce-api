import { Categories } from 'src/modules/categories/entities/category.entity';
import { OrderItem } from 'src/modules/orders/entities/orderDetails.entity';
import { decimalTransformer } from '../../../config/decimal.transformer';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';

@Entity({ name: 'products' })
@Check('"price" >= 0')
@Check('"stock" >= 0')
export class Products {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  name: string;
  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    transformer: decimalTransformer,
  })
  price: number;
  @Column({
    type: 'int',
    nullable: false,
  })
  stock: number;

  @Column({
    type: 'text',
    default: 'No image',
  })
  imgUrl?: string;

  @ManyToOne(() => Categories, (category) => category.products, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'category_id' })
  category: Relation<Categories>;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: Relation<OrderItem[]>;
}
