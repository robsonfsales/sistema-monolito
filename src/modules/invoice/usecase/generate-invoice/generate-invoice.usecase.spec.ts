import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity";
import Product from "../../domain/product.entity";
import Address from "../../value-object/Address";
import GenereateInvoiceUseCase from "./generate-invoice.usecase";

const address = new Address({
    street: "Street 1",
    number: "130",
    complement: "complemento 1",
    city: "São Paulo",
    state: "SP",
    zipCode: "07000-000",
});

const invoiceItem1 = new Product({         
    id: new Id("i1"),
    name: "Product 1",
    price: 10,
});

const invoiceItem2 = new Product({ 
    id: new Id("i2"),
    name: "Product 2",
    price: 20,
});

const invoiceEntity = new Invoice({
    id: new Id("1"), 
    name: "Invoice 1",
    document: "Document 1",
    address: address,
    items: [invoiceItem1, invoiceItem2],
    createdAt: new Date(),
    updatedAt: new Date(),
});

const MockRepository = () => {
    return {
        generate: jest.fn().mockReturnValue(Promise.resolve(invoiceEntity)),
        find: jest.fn(),
    };
};

describe("Generate invoice Usecase unit test", () => {

    it("should generate a invoice ", async () => {
        const repository = MockRepository();
        const usecase = new GenereateInvoiceUseCase(repository);

        const input = {
            name: invoiceEntity.name,
            document: invoiceEntity.document,
            street: invoiceEntity.address.street,
            number: invoiceEntity.address.number,
            complement: invoiceEntity.address.complement,
            city: invoiceEntity.address.city,
            state: invoiceEntity.address.state,
            zipCode: invoiceEntity.address.zipCode,
            items: invoiceEntity.items.map((item) => {
                let items = {
                    id: item.id.id,
                    name: item.name,
                    price: item.price,
                };
                return items;
            }),
        }

        const output = await usecase.execute(input);

        expect(repository.generate).toHaveBeenCalled();
        expect(output.id).toBeDefined();
        expect(output.name).toEqual(input.name);
        expect(output.document).toEqual(input.document);

        expect(output.street).toEqual(input.street);
        expect(output.number).toEqual(input.number);
        expect(output.complement).toEqual(input.complement);
        expect(output.city).toEqual(input.city);
        expect(output.state).toEqual(input.state);
        expect(output.zipCode).toEqual(input.zipCode);

        expect(output.items.length).toBe(2);
        expect(output.items[0].id).toEqual(input.items[0].id);
        expect(output.items[0].name).toEqual(input.items[0].name);
        expect(output.items[0].price).toBe(input.items[0].price);
        expect(output.items[1].id).toEqual(input.items[1].id);
        expect(output.items[1].name).toEqual(input.items[1].name);
        expect(output.items[1].price).toBe(input.items[1].price);

        expect(output.total).toEqual(invoiceEntity.total());
    });

});