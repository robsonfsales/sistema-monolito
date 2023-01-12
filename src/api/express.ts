import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { productRoute } from "./routes/product.route";
import { invoiceRoute } from "./routes/invoice.route";
import InvoiceModel from "../modules/invoice/repository/invoice.model";
import InvoiceItemModel from "../modules/invoice/repository/invoice-item.model";
import { clientRoute } from "./routes/client.route";
import { ClientModel as AdmClientModel } from "../modules/client-adm/repository/client.model";
import AdmProductModel from "../modules/product-adm/repository/product.model";
import { checkoutRoute } from "./routes/checkout.route";
import OrderModel from "../modules/checkout/repository/order.model";
import { OrderClientModel } from "../modules/checkout/repository/order-client.model";
import OrderProductModel from "../modules/checkout/repository/order-product.model";
import StoreCatalogProductModel from "../modules/store-catalog/repository/product.model";
import TransactionModel from "../modules/payment/repository/transaction.model";


export const app: Express = express();
app.use(express.json());
app.use("/products", productRoute);
app.use("/clients", clientRoute);
app.use("/checkout", checkoutRoute);
app.use("/invoice", invoiceRoute);

export let sequelize: Sequelize;

async function setupDb() {
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
    });

    sequelize.addModels(
        [
            AdmClientModel,
            AdmProductModel,
            StoreCatalogProductModel, 
            OrderModel,
            OrderClientModel, 
            OrderProductModel,
            TransactionModel,
            InvoiceModel, 
            InvoiceItemModel
        ]
    );
    await sequelize.sync();
}
setupDb();

export { OrderClientModel, AdmClientModel, AdmProductModel, StoreCatalogProductModel };
