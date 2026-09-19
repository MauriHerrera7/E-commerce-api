import { decimalTransformer } from '../../../config/decimal.transformer';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Orders } from './order.entity';
import { Products } from 'src/modules/products/entities/products.entity';

@Entity({ name: 'order_items' })
@Unique(['order', 'product'])
@Check('"quantity" > 0')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'unit_price',
    transformer: decimalTransformer,
  })
  unitPrice: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'varchar', length: 50, name: 'product_name' })
  productName: string;

  @ManyToOne(() => Orders, (order) => order.items, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Relation<Orders>;

  @ManyToOne(() => Products, (product) => product.orderItems, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'product_id' })
  product: Relation<Products>;
}
