import { app, sequelize } from "../express";
import request from "supertest";

const input = {
    name: "Client 1",
    document: "0000",
    email: "client1@email.com",
    street: "street 1",
    number: "1",
    complement: "complement 1",
    city: "city 1",
    state: "State 1",
    zipCode: "00000-111",
}

describe("E2E test for client-adm", () => {
    beforeEach(async () => {        
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should add a client ", async () => {
        const response = await request(app)
            .post("/clients")
            .send(input);

        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
        expect(response.body.name).toBe(input.name);
        expect(response.body.document).toBe(input.document);
        expect(response.body.email).toBe(input.email);
        expect(response.body.street).toBe(input.street);
        expect(response.body.number).toBe(input.number);
        expect(response.body.complement).toBe(input.complement);
        expect(response.body.city).toBe(input.city);
        expect(response.body.state).toBe(input.state);
        expect(response.body.zipCode).toBe(input.zipCode);
        expect(response.body.createdAt).toBeDefined();
        expect(response.body.updatedAt).toBeDefined();
    });

    it("should find a client ", async () => {
        const response1 = await request(app)
            .post("/clients")
            .send(input);

        expect(response1.status).toBe(200);

        const clientId = response1.body.id;

        const response2 = await request(app)
            .get(`/clients/${clientId}`);

        expect(response2.status).toBe(200);
        expect(response2.body.id).toBe(clientId);
        expect(response2.body.name).toBe(input.name);
        expect(response2.body.document).toBe(input.document);
        expect(response2.body.email).toBe(input.email);
        expect(response2.body.street).toBe(input.street);
        expect(response2.body.number).toBe(input.number);
        expect(response2.body.complement).toBe(input.complement);
        expect(response2.body.city).toBe(input.city);
        expect(response2.body.state).toBe(input.state);
        expect(response2.body.zipCode).toBe(input.zipCode);
        expect(response2.body.createdAt).toBe(response1.body.createdAt);
        expect(response2.body.updatedAt).toBe(response1.body.updatedAt);
    });
});