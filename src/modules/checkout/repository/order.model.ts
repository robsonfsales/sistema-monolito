import { BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import OrderProductModel from "./order-product.model";
import { OrderClientModel } from "./order-client.model";

@Table({
    tableName: "orders",
    timestamps: false,
})
export default class OrderModel extends Model {

    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @ForeignKey(() => OrderClientModel)
    @Column({ allowNull: false, field: "client_id"})
    clientId: string;

    @BelongsTo(() => OrderClientModel)
    client: Awaited<OrderClientModel>;

    @HasMany(() => OrderProductModel)
    items: OrderProductModel[];

    @Column({ allowNull: false})
    status: string;
}