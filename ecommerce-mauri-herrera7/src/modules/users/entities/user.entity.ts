import { Orders } from 'src/modules/orders/entities/order.entity';
import { Exclude } from 'class-transformer';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  email: string;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    select: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 30,
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  country: string;

  @Column({
    type: 'text',
  })
  address: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  city: string;

  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
  })
  isAdmin: boolean;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date | null;

  @OneToMany(() => Orders, (order) => order.user)
  orders: Relation<Orders[]>;
}
