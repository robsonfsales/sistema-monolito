import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";
import Address from "../../value-object/Address";
import FindInvoiceUseCase from "./find-invoice.usecase";

const address = new Address({
    street: "Street 1",
    number: "130",
    complement: "complemento 1",
    city: "São Paulo",
    state: "SP",
    zipCode: "07000-000",
});

const invoiceItem1 = new InvoiceItem({         
    id: new Id("i1"),
    productId: "p1",
    name: "Product 1",
    price: 10,
});

const invoiceItem2 = new InvoiceItem({ 
    id: new Id("i2"),
    productId: "p2",
    name: "Product 2",
    price: 20,
});

const invoice = new Invoice({
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
        generate: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    };
};

describe("Find Invoice usecase unit test", () => {

    it("should find a Invoice", async () => {
        const repository = MockRepository();
        const usecase = new FindInvoiceUseCase(repository);

        const input = {
            id: "1",
        };

        const output = await usecase.execute(input);

        expect(repository.find).toHaveBeenCalled();
        expect(output.id).toEqual(input.id);
        expect(output.name).toEqual(invoice.name);
        expect(output.document).toEqual(invoice.document);

        expect(output.address.street).toEqual(invoice.address.street);
        expect(output.address.number).toEqual(invoice.address.number);
        expect(output.address.complement).toEqual(invoice.address.complement);
        expect(output.address.city).toEqual(invoice.address.city);
        expect(output.address.state).toEqual(invoice.address.state);
        expect(output.address.zipCode).toEqual(invoice.address.zipCode);

        expect(output.items.length).toBe(2);

        expect(output.items[0].id).toEqual(invoice.items[0].productId);
        expect(output.items[0].name).toEqual(invoice.items[0].name);
        expect(output.items[0].price).toBe(invoice.items[0].price);

        expect(output.items[1].id).toEqual(invoice.items[1].productId);
        expect(output.items[1].name).toEqual(invoice.items[1].name);
        expect(output.items[1].price).toBe(invoice.items[1].price);

        expect(output.total).toEqual(invoice.total());
        expect(output.createdAt).toStrictEqual(invoice.createdAt);
    });
});