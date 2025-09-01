import { Users } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderDetails } from "./orderDetails.entity";

@Entity({ name: 'ORDERS' })

export class Orders {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column()
date: Date;

@OneToOne(()=> OrderDetails, (orderDetails)=> orderDetails.order)
orderDetails: OrderDetails;

@ManyToOne(()=> Users, (user) => user.order) 
@JoinColumn({ name: 'user_id' })
user: Users;
}