import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "./client.model";
import ClientRepository from "./client.repository";
import Client from "../domain/client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("ClientRepository test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ClientModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should find a client", async () => {
        const client = await ClientModel.create({
            id: "1",
            name: "Client 1",
            document: "0000",
            email: "client1@email.com",
            street: "street 1",
            number: "1",
            complement: "complement 1",
            city: "city 1",
            state: "State 1",
            zipCode: "00000-111",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const repository = new ClientRepository();
        const result = await repository.find(client.id);

        expect(result.id.id).toEqual(client.id);
        expect(result.name).toEqual(client.name);
        expect(result.email).toEqual(client.email);
        expect(result.document).toEqual(client.document);
        expect(result.street).toEqual(client.street);
        expect(result.number).toEqual(client.number);
        expect(result.complement).toEqual(client.complement);
        expect(result.city).toEqual(client.city);
        expect(result.state).toEqual(client.state);
        expect(result.zipCode).toEqual(client.zipCode);
        expect(result.createdAt).toStrictEqual(client.createdAt);
        expect(result.updatedAt).toStrictEqual(client.updatedAt);
    });

    it("should create a client", async () => {
        const client = new Client({
            id: new Id("1"), 
            name: "Client 1",
            document: "0000",
            email: "client1@email.com",
            street: "street 1",
            number: "1",
            complement: "complement 1",
            city: "city 1",
            state: "State 1",
            zipCode: "00000-111",
        });
        
        const repository = new ClientRepository();
        await repository.add(client);

        const clientDb = await ClientModel.findOne({ where : { id: client.id.id } });

        expect(clientDb).toBeDefined();
        expect(clientDb.id).toEqual(client.id.id);
        expect(clientDb.name).toEqual(client.name);
        expect(clientDb.email).toEqual(client.email);
        expect(clientDb.document).toEqual(client.document);
        expect(clientDb.street).toEqual(client.street);
        expect(clientDb.number).toEqual(client.number);
        expect(clientDb.complement).toEqual(client.complement);
        expect(clientDb.city).toEqual(client.city);
        expect(clientDb.state).toEqual(client.state);
        expect(clientDb.zipCode).toEqual(client.zipCode);
        expect(clientDb.createdAt).toStrictEqual(client.createdAt);
        expect(clientDb.updatedAt).toStrictEqual(client.updatedAt);
    });
});