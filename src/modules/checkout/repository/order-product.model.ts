import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import OrderModel from "./order.model";

@Table({
    tableName: "order-product",
    timestamps: false,
})
export default class OrderProductModel extends Model {

    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @Column({ allowNull: false })
    productId: string

    @ForeignKey(() => OrderModel)
    @Column({ allowNull: false, field: "order_id"})
    orderId: string;

    @BelongsTo(() => OrderModel)
    order: Awaited<OrderModel>;

    @Column({ allowNull: false })
    name: string;
  
    @Column({ allowNull: false })
    description: string;

    @Column({ allowNull: false })
    salesPrice: number;
}