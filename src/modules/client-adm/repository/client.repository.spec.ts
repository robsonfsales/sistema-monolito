import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "./client.model";
import ClientRepository from "./client.repository";
import Client from "../domain/client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../value-object/Address";

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
        const clientModel = await ClientModel.create({
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
        const clientEntity = await repository.find(clientModel.id);

        expect(clientEntity.id.id).toEqual(clientModel.id);
        expect(clientEntity.name).toEqual(clientModel.name);
        expect(clientEntity.email).toEqual(clientModel.email);
        expect(clientEntity.document).toEqual(clientModel.document);
        expect(clientEntity.address.street).toEqual(clientModel.street);
        expect(clientEntity.address.number).toEqual(clientModel.number);
        expect(clientEntity.address.complement).toEqual(clientModel.complement);
        expect(clientEntity.address.city).toEqual(clientModel.city);
        expect(clientEntity.address.state).toEqual(clientModel.state);
        expect(clientEntity.address.zipCode).toEqual(clientModel.zipCode);
        expect(clientEntity.createdAt).toStrictEqual(clientModel.createdAt);
        expect(clientEntity.updatedAt).toStrictEqual(clientModel.updatedAt);
    });

    it("should create a client", async () => {
        const clientEntity = new Client({
            id: new Id("1"), 
            name: "Client 1",
            document: "0000",
            email: "client1@email.com",
            address: new Address({
                street: "street 1",
                number: "1",
                complement: "complement 1",
                city: "city 1",
                state: "State 1",
                zipCode: "00000-111"
            }),
        });
        
        const repository = new ClientRepository();
        await repository.add(clientEntity);

        const clientDb = await ClientModel.findOne({ where : { id: clientEntity.id.id } });

        expect(clientDb).toBeDefined();
        expect(clientDb.id).toEqual(clientEntity.id.id);
        expect(clientDb.name).toEqual(clientEntity.name);
        expect(clientDb.email).toEqual(clientEntity.email);
        expect(clientDb.document).toEqual(clientEntity.document);
        expect(clientDb.street).toEqual(clientEntity.address.street);
        expect(clientDb.number).toEqual(clientEntity.address.number);
        expect(clientDb.complement).toEqual(clientEntity.address.complement);
        expect(clientDb.city).toEqual(clientEntity.address.city);
        expect(clientDb.state).toEqual(clientEntity.address.state);
        expect(clientDb.zipCode).toEqual(clientEntity.address.zipCode);
        expect(clientDb.createdAt).toStrictEqual(clientEntity.createdAt);
        expect(clientDb.updatedAt).toStrictEqual(clientEntity.updatedAt);
    });
});