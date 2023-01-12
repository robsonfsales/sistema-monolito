import {app, sequelize} from '../express';
import request from "supertest";

const inputProduct1 = {
    name: "Product 1",
    description: "Product 1 description",
    purchasePrice: 15,
    stock: 36,
}

const inputProduct2 = {
    name: "Product 2",
    description: "Product 2 description",
    purchasePrice: 12,
    stock: 22,
}

const inputProduct3 = {
    name: "Product 3",
    description: "Product 3 description",
    purchasePrice: 77,
    stock: 83,
}

describe("E2E test for product", () => {
    beforeEach(async () => {        
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const response = await request(app)
            .post("/products")
            .send(inputProduct1);

        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
        expect(response.body.name).toBe(inputProduct1.name);
        expect(response.body.description).toBe(inputProduct1.description);
        expect(response.body.purchasePrice).toBe(inputProduct1.purchasePrice);
        expect(response.body.stock).toBe(inputProduct1.stock);
        expect(response.body.createdAt).toBeDefined();
        expect(response.body.updatedAt).toBeDefined();
    });

    it("should get stock of a product", async () => {
        const response1 = await request(app)
            .post("/products")
            .send(inputProduct1);

        expect(response1.status).toBe(200);

        const productId = response1.body.id;
        const stock = response1.body.stock;

        const response3 = await request(app)
            .get(`/products/${productId}`);

        expect(response3.status).toBe(200);
        expect(response3.body.productId).toBeDefined();
        expect(response3.body.productId).toBe(productId);
        expect(response3.body.stock).toBe(stock);
    });
});