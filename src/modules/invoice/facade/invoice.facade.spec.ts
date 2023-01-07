import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/Invoice.model";
import ProductModel from "../repository/product.model";
import InvoiceItemModel from "../repository/invoice-item-product.model";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import InvoiceFacade from "./invoice.facade";
import Address from "../value-object/Address";
import Product from "../domain/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../domain/invoice-item.entity";
import Invoice from "../domain/invoice.entity";
import GenereateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";

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

const invoiceItem1 = new InvoiceItem({
    id: new Id("i1"),
    productId: product1.id.id,
    name: product1.name,
    price: product1.price,
});

const invoiceItem2 = new InvoiceItem({
    id: new Id("i2"),
    productId: product2.id.id,
    name: product2.name,
    price: product2.price,
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

describe("InvoiceFacade test", () => {
    let sequileze: Sequelize;

    beforeEach(async() => {
        sequileze = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        sequileze.addModels([InvoiceModel, InvoiceItemModel, ProductModel]);
        await sequileze.sync();
    });

    afterEach(async() => {
        await sequileze.close();
    });

    it("should find a invoice", async () => {

        await ProductModel.create({
            id: product1.id.id,
            name: product1.name,
            price: product1.price,
        });

        await ProductModel.create({
            id: product2.id.id,
            name: product2.name,
            price: product2.price,
        });

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
                id: item.id.id,
                product_id: item.productId,
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

        // // criar repositorio
        // const repository = new InvoiceRepository();
        
        // // criar usecase e injetar repositorio no usecase
        // const usecase = new FindInvoiceUseCase(repository);

        // // criar facade e injetar o caso de uso na facade
        // const facade = new InvoiceFacade({
        //     generateUseCase: undefined,
        //     findUseCase: usecase,
        // });

        const facade = InvoiceFacadeFactory.create();

        const input = { id: invoiceModel.id };

        const output = await facade.find(input);

        expect(output.id).toBe(invoiceEntity.id.id);
        expect(output.name).toEqual(invoiceEntity.name);
        expect(output.document).toEqual(invoiceEntity.document);

        expect(output.address.street).toEqual(invoiceEntity.address.street);
        expect(output.address.number).toEqual(invoiceEntity.address.number);
        expect(output.address.complement).toEqual(invoiceEntity.address.complement);
        expect(output.address.city).toEqual(invoiceEntity.address.city);
        expect(output.address.state).toEqual(invoiceEntity.address.state);
        expect(output.address.zipCode).toEqual(invoiceEntity.address.zipCode);

        expect(output.items.length).toBe(2);
        expect(output.items[0].id).toEqual(invoiceEntity.items[0].productId);
        expect(output.items[0].name).toEqual(invoiceEntity.items[0].name);
        expect(output.items[0].price).toEqual(invoiceEntity.items[0].price);
        expect(output.items[1].id).toEqual(invoiceEntity.items[1].productId);
        expect(output.items[1].name).toEqual(invoiceEntity.items[1].name);
        expect(output.items[1].price).toEqual(invoiceEntity.items[1].price);

        expect(output.total).toEqual(invoiceEntity.total());
        expect(output.createdAt).toStrictEqual(invoiceEntity.createdAt);
    });

    it("should generate a invoice", async () => {

        await ProductModel.create({
            id: product1.id.id,
            name: product1.name,
            price: product1.price,
        });

        await ProductModel.create({
            id: product2.id.id,
            name: product2.name,
            price: product2.price,
        });

        // // criar repositorio
        // const repository = new InvoiceRepository();

        // // criar usecase e injetar repositorio no usecase
        // const usecase = new GenereateInvoiceUseCase(repository);
        
        // // criar facade e injetar o caso de uso na facade
        // const facade = new InvoiceFacade({
        //     generateUseCase: usecase,
        //     findUseCase: undefined,
        // });

        const facade = InvoiceFacadeFactory.create();

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
                    id: item.productId,
                    name: item.name,
                    price: item.price,
                };
                return items;
            }),
        };
        const output = await facade.generate(input);

        expect(output.id).toBeDefined();
        expect(output.name).toEqual(invoiceEntity.name);
        expect(output.document).toEqual(invoiceEntity.document);

        expect(output.street).toEqual(invoiceEntity.address.street);
        expect(output.number).toEqual(invoiceEntity.address.number);
        expect(output.complement).toEqual(invoiceEntity.address.complement);
        expect(output.city).toEqual(invoiceEntity.address.city);
        expect(output.state).toEqual(invoiceEntity.address.state);
        expect(output.zipCode).toEqual(invoiceEntity.address.zipCode);

        expect(output.items.length).toBe(2);
        expect(output.items[0].id).toEqual(invoiceEntity.items[0].productId);
        expect(output.items[0].name).toEqual(invoiceEntity.items[0].name);
        expect(output.items[0].price).toEqual(invoiceEntity.items[0].price);
        expect(output.items[1].id).toEqual(invoiceEntity.items[1].productId);
        expect(output.items[1].name).toEqual(invoiceEntity.items[1].name);
        expect(output.items[1].price).toEqual(invoiceEntity.items[1].price);

        expect(output.total).toEqual(invoiceEntity.total());        
    });

});