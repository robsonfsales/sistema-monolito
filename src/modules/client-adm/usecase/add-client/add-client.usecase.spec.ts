import AddClientUseCase from "./add-client.usecase";

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn(),
    };
};

describe("Add Client Usecase unit test", () => {

    it("should add a client ", async () => {
        const repository = MockRepository();
        const usecase = new AddClientUseCase(repository);

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

        const result = await usecase.execute(input);
        
        expect(repository.add).toHaveBeenCalled();
        expect(result.id).toBeDefined();
        expect(result.name).toEqual(input.name);
        expect(result.email).toEqual(input.email);
        expect(result.document).toEqual(input.document);
        expect(result.street).toEqual(input.street);
        expect(result.number).toEqual(input.number);
        expect(result.complement).toEqual(input.complement);
        expect(result.city).toEqual(input.city);
        expect(result.state).toEqual(input.state);
        expect(result.zipCode).toEqual(input.zipCode);
    });

});