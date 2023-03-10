import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import ClientRepository from "../repository/client.repository";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import ClientAdmFacade from "./client-adm.facade";
import ClientAdmFacadeFactory from "../factory/client-adm.facade.factory";

describe("ClientAdmFacade test", () => {

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

    it("should create a client", async () => {
        // criar repositorio
        // criar usecase
        // injetar repositorio no usecase
        // criar facade
        // injetar o caso de uso na facade

        const repository = new ClientRepository();
        const addUsecaseClient = new AddClientUseCase(repository);
        const facade = new ClientAdmFacade({
            addUseCase: addUsecaseClient,
            findUseCase: undefined,
        });

        const input = {
            id:"1",
            name: "Client 1",
            document: "0000",
            email: "client1@email.com",
            street: "street 1",
            number: "1",
            complement: "complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "00000-111",
        }

        await facade.add(input);

        const clientDb = await ClientModel.findOne({ where : { id: input.id } });

        expect(clientDb).toBeDefined();
        expect(clientDb.id).toEqual(input.id);
        expect(clientDb.name).toEqual(input.name);
        expect(clientDb.email).toEqual(input.email);
        expect(clientDb.document).toEqual(input.document);
        expect(clientDb.street).toEqual(input.street);
        expect(clientDb.number).toEqual(input.number);
        expect(clientDb.complement).toEqual(input.complement);
        expect(clientDb.city).toEqual(input.city);
        expect(clientDb.state).toEqual(input.state);
        expect(clientDb.zipCode).toEqual(input.zipCode);
        // expect(clientDb.createdAt).toStrictEqual(client.createdAt);
        // expect(clientDb.updatedAt).toStrictEqual(client.updatedAt);
    });

    it("should find a client", async ()=> {
        // criar repositorio
        // criar usecase
        // injetar repositorio no usecase
        // criar facade
        // injetar o caso de uso na facade

        // const repository = new ClientRepository();
        // const findUsecaseClient = new FindClientUseCase(repository);
        // const facade = new ClientAdmFacade({
        //     addUseCase: undefined,
        //     findUseCase: findUsecaseClient,
        // });

        const facade = ClientAdmFacadeFactory.create();

        const clientDb = await ClientModel.create({
            id:"1",
            name: "Client 1",
            document: "0000",
            email: "client1@email.com",
            street: "street 1",
            number: "1",
            complement: "complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "00000-111",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const client = await facade.find({id: "1"});

        expect(clientDb).toBeDefined();
        expect(clientDb.id).toEqual(client.id);
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