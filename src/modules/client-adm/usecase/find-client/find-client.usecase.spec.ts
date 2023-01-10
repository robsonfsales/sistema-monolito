import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import Address from "../../value-object/Address";
import FindClientUseCase from "./find-client.usecase";

const client = new Client({
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

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(client)),
    };
};

describe("Find Client Usecase unit test", () => {

    it("should find a client", async () => {
        const repository = MockRepository();
        const usecase = new FindClientUseCase(repository);

        const input = {
            id: "1",
        };

        const result = await usecase.execute(input);

        expect(repository.find).toHaveBeenCalled();
        expect(result.id).toEqual(input.id);
        expect(result.name).toEqual(client.name);
        expect(result.email).toEqual(client.email);
        expect(result.document).toEqual(client.document);
        expect(result.street).toEqual(client.address.street);
        expect(result.number).toEqual(client.address.number);
        expect(result.complement).toEqual(client.address.complement);
        expect(result.city).toEqual(client.address.city);
        expect(result.state).toEqual(client.address.state);
        expect(result.zipCode).toEqual(client.address.zipCode);
    });

});