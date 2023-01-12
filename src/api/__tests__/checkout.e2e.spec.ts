import Id from "../../modules/@shared/domain/value-object/id.value-object";
import Client from "../../modules/checkout/domain/client.entity";
import Product from "../../modules/checkout/domain/product.entity";
import Address from "../../modules/checkout/value-object/Address";
import { app, sequelize, OrderClientModel, AdmClientModel, AdmProductModel, StoreCatalogProductModel } from "../express";
import request from "supertest";

const client = new Client({
    id: new Id("1c"),
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
    salesPrice: 20,
});

const product2 = new Product({
    id: new Id("p2"),
    name: "Product 2",
    description: "Description p2",
    salesPrice: 40,
});

const product3 = new Product({
    id: new Id("p3"),
    name: "Product 3",
    description: "Description p3",
    salesPrice: 50,
});

describe("E2E test for checkout", () => {
    beforeEach(async () => {        
        await sequelize.sync({force: true});

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

        await AdmClientModel.create({
            id: client.id.id,
            name: client.name,
            document: client.document,
            email: client.email,
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

        for (const product of products) {  
            await AdmProductModel.create({
                id: product.id.id,
                name: product.name,
                description: product.description,              
                purchasePrice: (product.salesPrice - 10),
                stock: 10,    
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            await StoreCatalogProductModel.create({
                id: product.id.id,
                name: product.name,
                description: product.description,              
                salesPrice: product.salesPrice,
            });
        };
    });

    // afterAll(async () => {
    //    await sequelize.close();
    // });

    it("should do the checkout", async () => {
        const input = {
            clientId: client.id.id,
            products: [
                { productId: product1.id.id },
                { productId: product2.id.id },
                { productId: product3.id.id },
            ],
        };     

        const response = await request(app)
            .post("/checkout")
            .send(input);
        
        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
        expect(response.body.invoiceId).toBeDefined();
        expect(response.body.status).toEqual("approved");
        expect(response.body.total).toBe(110);
        
        expect(response.body.products).toStrictEqual([
            { productId: product1.id.id},
            { productId: product2.id.id},
            { productId: product3.id.id},
        ]);
    });
});