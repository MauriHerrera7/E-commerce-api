import { Products } from 'src/modules/products/entities/products.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';

@Entity({ name: 'categories' })
export class Categories {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  name: string;

  @OneToMany(() => Products, (product) => product.category)
  products: Relation<Products[]>;
}
