import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import ProductModel from "./product.model";
import InvoiceModel from "./Invoice.model";

@Table({
    tableName: "invoice_items",
    timestamps: false,
})
export default class InvoiceItemModel extends Model {
  
    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @ForeignKey(() => InvoiceModel)
    @Column({ allowNull: false})
    invoice_id: string;

    @ForeignKey(() => ProductModel)
    @Column({ allowNull: false})
    product_id: string;

    @BelongsTo(() => ProductModel)
    product: ProductModel;

    @Column({ allowNull: false })
    name: string;
  
    @Column({ allowNull: false })
    price: number;
}