import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceRepository from "./invoice.repository";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../value-object/Address";
import Product from "../domain/product.entity";
import Invoice from "../domain/invoice.entity";

const address = new Address({
    street: "Street 1",
    number: "130",
    complement: "complemento 1",
    city: "São Paulo",
    state: "SP",
    zipCode: "07000-000",
});

const product1 = new Product({
    id: new Id("p1"),
    name: "Product 1",
    price: 10,
});

const product2 = new Product({
    id: new Id("p2"),
    name: "Product 2",
    price: 20,
});

const invoiceEntity = new Invoice({
    id: new Id("1"), 
    name: "Invoice 1",
    document: "Document 1",
    address: address,
    items: [product1, product2],
});

describe("Invoice repository tests", () => {
    let sequileze: Sequelize;

    beforeEach(async() => {
        sequileze = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        sequileze.addModels([InvoiceModel, InvoiceItemModel]);
        await sequileze.sync();
    });

    afterEach(async() => {
        await sequileze.close();
    });

    it("should find a invoice", async () => {

        const invoiceModel = await InvoiceModel.create({
            id: invoiceEntity.id.id,
            name: invoiceEntity.name,          
            document: invoiceEntity.document,
            street: invoiceEntity.address.street,
            number: invoiceEntity.address.number,
            complement: invoiceEntity.address.complement,
            city: invoiceEntity.address.city,
            state: invoiceEntity.address.state,
            zipCode: invoiceEntity.address.zipCode,
            items: invoiceEntity.items.map((item) => ({
                id: new Id().id,
                productId: item.id.id,
                name: item.name,
                price: item.price
            })), 
            total: invoiceEntity.total(),
            createdAt: invoiceEntity.createdAt,
            updatedAt: invoiceEntity.updatedAt,
        },
        {
            include: [{model: InvoiceItemModel}],
        });

        const repository = new InvoiceRepository();
        const result = await repository.find(invoiceModel.id);

        expect(result.id.id).toEqual(invoiceEntity.id.id);
        expect(result.name).toEqual(invoiceEntity.name);
        expect(result.document).toEqual(invoiceEntity.document);

        // address
        expect(result.address.street).toEqual(invoiceEntity.address.street);
        expect(result.address.number).toEqual(invoiceEntity.address.number);
        expect(result.address.complement).toEqual(invoiceEntity.address.complement);
        expect(result.address.city).toEqual(invoiceEntity.address.city);
        expect(result.address.state).toEqual(invoiceEntity.address.state);
        expect(result.address.zipCode).toEqual(invoiceEntity.address.zipCode);

        // items
        expect(result.items.length).toBe(2);
        expect(result.items[0].id.id).toEqual(invoiceEntity.items[0].id.id);
        expect(result.items[0].name).toEqual(invoiceEntity.items[0].name);
        expect(result.items[0].price).toEqual(invoiceEntity.items[0].price);

        expect(result.items[1].id.id).toEqual(invoiceEntity.items[1].id.id);
        expect(result.items[1].name).toEqual(invoiceEntity.items[1].name);
        expect(result.items[1].price).toBe(invoiceEntity.items[1].price);

        expect(result.total).toBe(invoiceEntity.total);
        expect(result.createdAt).toStrictEqual(invoiceEntity.createdAt);
        expect(result.updatedAt).toStrictEqual(invoiceEntity.updatedAt);
    });

    it("should generate a invoice", async () => {
        
        const repository = new InvoiceRepository();
        const result = await repository.generate(invoiceEntity);

        expect(result.id.id).toEqual(invoiceEntity.id.id);
        expect(result.name).toEqual(invoiceEntity.name);
        expect(result.document).toEqual(invoiceEntity.document);

        // address
        expect(result.address.street).toEqual(invoiceEntity.address.street);
        expect(result.address.number).toEqual(invoiceEntity.address.number);
        expect(result.address.complement).toEqual(invoiceEntity.address.complement);
        expect(result.address.city).toEqual(invoiceEntity.address.city);
        expect(result.address.state).toEqual(invoiceEntity.address.state);
        expect(result.address.zipCode).toEqual(invoiceEntity.address.zipCode);

        // items
        expect(result.items.length).toBe(2);
        expect(result.items[0].id.id).toEqual(invoiceEntity.items[0].id.id);
        expect(result.items[0].name).toEqual(invoiceEntity.items[0].name);
        expect(result.items[0].price).toEqual(invoiceEntity.items[0].price);

        expect(result.items[1].id.id).toEqual(invoiceEntity.items[1].id.id);
        expect(result.items[1].name).toEqual(invoiceEntity.items[1].name);
        expect(result.items[1].price).toBe(invoiceEntity.items[1].price);

        expect(result.total).toBe(invoiceEntity.total);
        expect(result.createdAt).toStrictEqual(invoiceEntity.createdAt);
        expect(result.updatedAt).toStrictEqual(invoiceEntity.updatedAt);
    });
});
