import { Users } from 'src/modules/users/entities/user.entity';
import { decimalTransformer } from '../../../config/decimal.transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { OrderItem } from './orderDetails.entity';

export enum OrderStatus {
  Pending = 'pending',
  Paid = 'paid',
  Cancelled = 'cancelled',
}

@Index('UQ_orders_user_idempotency_key', ['user', 'idempotencyKey'], {
  unique: true,
})
@Entity({ name: 'orders' })
export class Orders {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 20, default: OrderStatus.Pending })
  status: OrderStatus;

  @Column({
    name: 'idempotency_key',
    type: 'varchar',
    length: 128,
    nullable: true,
  })
  idempotencyKey?: string | null;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: decimalTransformer,
  })
  total: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: Relation<OrderItem[]>;

  @ManyToOne(() => Users, (user) => user.orders, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'user_id' })
  user: Relation<Users>;
}
