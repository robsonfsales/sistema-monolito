import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import Address from "../value-object/Address";
import OrderModel from "./order.model";
import ProductModel from "./order-product.model";

export default class CheckoutRepository implements CheckoutGateway {

    async addOrder(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id.id,
            clientId: entity.client.id.id,
            items: entity.products.map((item) => ({
                id: new Id().id,
                productId: item.id.id, 
                name: item.name,
                description: item.description,
                salesPrice: item.salesPrice,
            })),
            status: entity.status,
        },
        {
            include: [{model: ProductModel}],
        });
    }

    async findOrder(id: string): Promise<Order | null> {
        const orderModel = await OrderModel.findOne({
            where: { id },
            include: ["items", "client"],
        });

        if(!orderModel) {
            return null;
        }

        return new Order({
            id: new Id(orderModel.id),
            client: new Client({
                    id: new Id(orderModel.client.id),
                    name: orderModel.client.name,
                    email: orderModel.client.email,
                    document: orderModel.client.document,
                    address: new Address({
                        street: orderModel.client.street,
                        number: orderModel.client.number,
                        complement: orderModel.client.complement,
                        city: orderModel.client.city,
                        state: orderModel.client.state,
                        zipCode: orderModel.client.zipCode,
                    }),
                    createdAt: orderModel.client.createdAt,
                    updatedAt: orderModel.client.updatedAt,
                }),
            products: orderModel.items.map((orderItem) => {
                let products = new Product({
                    id: new Id(orderItem.productId),
                    name: orderItem.name,
                    description: orderItem.description,
                    salesPrice: orderItem.salesPrice, 
                });
                return products;
            }),
            status: orderModel.status,
        });
    }
}