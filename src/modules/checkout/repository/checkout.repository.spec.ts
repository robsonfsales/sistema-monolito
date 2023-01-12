import { Sequelize, UpdatedAt } from "sequelize-typescript";
import CheckoutRepository from "./checkout.repository";
import OrderModel from "./order.model";
import { OrderClientModel } from "./order-client.model";
import OrderProductModel from "./order-product.model";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../value-object/Address";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";
import Order from "../domain/order.entity";


const client = new Client({
    id: new Id("1"),
    name: "client 1",
    email: "client1@email.com",
    document: "0001",
    address: new Address({
        street: "street 1",
        number: "100",
        complement: "complement 1",
        city: "city 1",
        state: "state 1",
        zipCode: "10000-000",
    }),
});

const product1 = new Product({
    id: new Id("p1"),
    name: "Product 1",
    description: "Description p1",
    salesPrice: 10,
});

const product2 = new Product({
    id: new Id("p2"),
    name: "Product 2",
    description: "Description p2",
    salesPrice: 20,
});

const product3 = new Product({
    id: new Id("p3"),
    name: "Product 3",
    description: "Description p3",
    salesPrice: 30,
});

describe("CheckoutRepository test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([OrderClientModel, OrderProductModel, OrderModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a new order", async () => {
        await OrderClientModel.create({
            id: client.id.id,
            name: client.name,
            email: client.email,
            document: client.document,
            street: client.address.street,
            number: client.address.number,
            complement: client.address.complement,
            city: client.address.city,
            state: client.address.state,
            zipCode: client.address.zipCode,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        });

        const products = [product1, product2];

        const orderProps = {
            id: "o1",
            client: client,
            products: products,
        }

        const order = new Order({
            id: new Id(orderProps.id),
            client: orderProps.client,
            products: orderProps.products,
        });

        const repository = new CheckoutRepository();
        await repository.addOrder(order);

        const orderDb = await OrderModel.findOne({
            where: { id: order.id.id },
            include: [{model: OrderProductModel}, {model: OrderClientModel}],
        });

        expect(orderDb.id).toEqual(order.id.id);
        expect(orderDb.clientId).toEqual(order.client.id.id);
        expect(orderDb.items.length).toBe(2);
        expect(orderDb.status).toEqual(order.status);
        
        // Client
        expect(orderDb.client.id).toEqual(order.client.id.id);
        expect(orderDb.client.name).toEqual(order.client.name);
        expect(orderDb.client.email).toEqual(order.client.email);
        expect(orderDb.client.document).toEqual(order.client.document);
        expect(orderDb.client.street).toEqual(order.client.address.street);
        expect(orderDb.client.number).toEqual(order.client.address.number);
        expect(orderDb.client.complement).toEqual(order.client.address.complement);
        expect(orderDb.client.city).toEqual(order.client.address.city);
        expect(orderDb.client.state).toEqual(order.client.address.state);
        expect(orderDb.client.zipCode).toEqual(order.client.address.zipCode);
        expect(orderDb.client.createdAt).toEqual(order.client.createdAt);
        expect(orderDb.client.updatedAt).toEqual(order.client.updatedAt);

        // Product items
        expect(orderDb.items[0].id).toBeDefined();
        expect(orderDb.items[0].productId).toEqual(order.products[0].id.id);
        expect(orderDb.items[0].name).toEqual(order.products[0].name);
        expect(orderDb.items[0].description).toEqual(order.products[0].description);
        expect(orderDb.items[0].salesPrice).toEqual(order.products[0].salesPrice);

        expect(orderDb.items[1].id).toBeDefined();
        expect(orderDb.items[1].productId).toEqual(order.products[1].id.id);
        expect(orderDb.items[1].name).toEqual(order.products[1].name);
        expect(orderDb.items[1].description).toEqual(order.products[1].description);
        expect(orderDb.items[1].salesPrice).toEqual(order.products[1].salesPrice);
    });

    it("should find a order", async () => {
        await OrderClientModel.create({
            id: client.id.id,
            name: client.name,
            email: client.email,
            document: client.document,
            street: client.address.street,
            number: client.address.number,
            complement: client.address.complement,
            city: client.address.city,
            state: client.address.state,
            zipCode: client.address.zipCode,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        });

        const products = [product1, product2, product3];

        const orderProps = {
            id: "o2",
            client: client,
            products: products,
        }

        const orderEntity = new Order({
            id: new Id(orderProps.id),
            client: orderProps.client,
            products: orderProps.products,
        });

        await OrderModel.create({
            id: orderEntity.id.id,
            clientId: orderEntity.client.id.id,
            items: orderEntity.products.map((item) => ({
                id: new Id().id,
                productId: item.id.id,
                name: item.name,
                description: item.description,
                salesPrice: item.salesPrice,
            })),
            status: orderEntity.status,
        },
        {
            include: [{model: OrderProductModel}],
        });

        const repository = new CheckoutRepository();
        const result = await repository.findOrder(orderEntity.id.id);

        expect(result.id.id).toEqual(orderEntity.id.id);
        expect(result.client.id.id).toEqual(orderEntity.client.id.id);
        expect(result.products.length).toBe(3);
        expect(result.status).toEqual(orderEntity.status);
        
        // Client
        expect(result.client.id.id).toEqual(orderEntity.client.id.id);
        expect(result.client.name).toEqual(orderEntity.client.name);
        expect(result.client.email).toEqual(orderEntity.client.email);
        expect(result.client.document).toEqual(orderEntity.client.document);
        expect(result.client.address.street).toEqual(orderEntity.client.address.street);
        expect(result.client.address.number).toEqual(orderEntity.client.address.number);
        expect(result.client.address.complement).toEqual(orderEntity.client.address.complement);
        expect(result.client.address.city).toEqual(orderEntity.client.address.city);
        expect(result.client.address.state).toEqual(orderEntity.client.address.state);
        expect(result.client.address.zipCode).toEqual(orderEntity.client.address.zipCode);
        expect(result.client.createdAt).toEqual(orderEntity.client.createdAt);
        expect(result.client.updatedAt).toEqual(orderEntity.client.updatedAt);
        
        // Product items
        expect(result.products[0].id.id).toEqual(orderEntity.products[0].id.id);
        expect(result.products[0].name).toEqual(orderEntity.products[0].name);
        expect(result.products[0].description).toEqual(orderEntity.products[0].description);
        expect(result.products[0].salesPrice).toEqual(orderEntity.products[0].salesPrice);

        expect(result.products[1].id.id).toEqual(orderEntity.products[1].id.id);
        expect(result.products[1].name).toEqual(orderEntity.products[1].name);
        expect(result.products[1].description).toEqual(orderEntity.products[1].description);
        expect(result.products[1].salesPrice).toEqual(orderEntity.products[1].salesPrice);

        expect(result.products[2].id.id).toEqual(orderEntity.products[2].id.id);
        expect(result.products[2].name).toEqual(orderEntity.products[2].name);
        expect(result.products[2].description).toEqual(orderEntity.products[2].description);
        expect(result.products[2].salesPrice).toEqual(orderEntity.products[2].salesPrice);
    });

    it("find an order that does not exist", async () => {

        const repository = new CheckoutRepository();
        const result = await repository.findOrder("1");

        expect(result).toBeNull();

    });
});