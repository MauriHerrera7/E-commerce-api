import { Orders } from 'src/modules/orders/entities/order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'USERS' })
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

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'bigint',
  })
  phone: number;

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
    nullable: true,
  })
  isAdmin: boolean;

  @OneToMany(() => Orders, (order) => order.user)
  order: Orders[];
}
