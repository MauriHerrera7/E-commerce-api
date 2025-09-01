import { Users } from "src/modules/users/entities/user.entity";
import { OrderDetails } from "./orderDetails.entity";
export declare class Orders {
    id: string;
    date: Date;
    orderDetails: OrderDetails;
    user: Users;
}
