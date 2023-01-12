import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import InvoiceModel from "./Invoice.model";

@Table({
    modelName: "InvoiceProductModel",
    tableName: "invoice-product",
    timestamps: false,
})
export default class ProductModel extends Model {
    @PrimaryKey
    @Column({allowNull: false})
    id: string;

    @Column({ allowNull: false })
    productId: string

    @ForeignKey(() => InvoiceModel)
    @Column({ allowNull: false, field: "invoice_id"})
    invoiceId: string;

    @BelongsTo(() => InvoiceModel)
    invoice: Awaited<InvoiceModel>;

    @Column({allowNull: false})
    name: string;

    @Column({allowNull: false})
    price: number;
}