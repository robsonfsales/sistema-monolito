import { Sequelize } from "sequelize-typescript";

import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Address from "../value-object/Address";
import Product from "../domain/product.entity";

import OrderModel from "../repository/order.model";
import { OrderClientModel } from "../repository/order-client.model";
import OrderProductModel from "../repository/order-product.model";

import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";
import { PlaceOrderCheckoutFacadeInputDto } from "./checkout.facade.interface";
import CheckoutRepository from "../repository/checkout.repository";
import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import ProductAdmfacadeFatory from "../../product-adm/factory/product-adm.facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/store-catalog.facade.factory";
import InvoiceFacadeFactory from "../../invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory";
import { ClientModel as AdmClientModel} from "../../client-adm/repository/client.model";
import AdmProductModel from "../../product-adm/repository/product.model";
import StoreCatalogProductModel from "../../store-catalog/repository/product.model";
import TransactionModel from "../../payment/repository/transaction.model";

import InvoiceModel from "../../invoice/repository/invoice.model";
import InvoiceItemModel from "../../invoice/repository/invoice-item.model";


const client = new Client({
    id: new Id("1"),
    name: "client 1",
    email: "client1@email.com",
    document: "0001",
    address: new Address({
        street: "street 1",
        number: "100",
        complement: "complement 1",
        city: "city 1",
        state: "state 1",
        zipCode: "10000-000",
    }),
});

const product1 = new Product({
    id: new Id("p1"),
    name: "Product 1",
    description: "Description p1",
    salesPrice: 20,
});

const product2 = new Product({
    id: new Id("p2"),
    name: "Product 2",
    description: "Description p2",
    salesPrice: 40,
});

const product3 = new Product({
    id: new Id("p3"),
    name: "Product 3",
    description: "Description p3",
    salesPrice: 50,
});

describe("CheckoutFacade unit test", () => {
    let sequelize: Sequelize;

    beforeAll(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
            pool: {
                max: 10,
                min: 5,
                acquire: 30000,
                idle: 10000
            },
        });

        sequelize.addModels([
            AdmClientModel,
            AdmProductModel,
            StoreCatalogProductModel,
            
            OrderModel,
            OrderClientModel, 
            OrderProductModel,
            TransactionModel,

            InvoiceItemModel,
            InvoiceModel,
        ]);
        await sequelize.sync();

        await OrderClientModel.create({
            id: client.id.id,
            name: client.name,
            email: client.email,
            document: client.document,
            street: client.address.street,
            number: client.address.number,
            complement: client.address.complement,
            city: client.address.city,
            state: client.address.state,
            zipCode: client.address.zipCode,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        });

        await AdmClientModel.create({
            id: client.id.id,
            name: client.name,
            document: client.document,
            email: client.email,
            street: client.address.street,
            number: client.address.number,
            complement: client.address.complement,
            city: client.address.city,
            state: client.address.state,
            zipCode: client.address.zipCode,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        });

        const products = [product1, product2, product3];

        for (const product of products) {  
            await AdmProductModel.create({
                id: product.id.id,
                name: product.name,
                description: product.description,              
                purchasePrice: (product.salesPrice - 10),
                stock: 10,    
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            await StoreCatalogProductModel.create({
                id: product.id.id,
                name: product.name,
                description: product.description,              
                salesPrice: product.salesPrice,
            });
        };
    });

    // afterAll(async () => {
    //     await sequelize.close();
    // });


    it("should not be approved", async () => {
        const props = {
            checkouRepository: new CheckoutRepository(),
            clientFacade: ClientAdmFacadeFactory.create(), 
            productFacade: ProductAdmfacadeFatory.create(),
            catalogFacade: StoreCatalogFacadeFactory.create(),
            invoiceFacade: InvoiceFacadeFactory.create(),
            paymentFacade: PaymentFacadeFactory.create(),
        }

        const placeOrderUseCase = new PlaceOrderUseCase(
            props.clientFacade,
            props.productFacade,
            props.catalogFacade,
            props.checkouRepository,
            props.invoiceFacade,
            props.paymentFacade,
        );

        const input: PlaceOrderCheckoutFacadeInputDto = {
            clientId: client.id.id,
            products: [{ productId: product1.id.id }, { productId: product2.id.id }],
        }

        let output = await placeOrderUseCase.execute(input);

        expect(output.id).toBeDefined();
        expect(output.invoiceId).toBeNull();
        expect(output.status).toEqual("pending");
        expect(output.total).toBe(60);
        
        expect(output.products).toStrictEqual([
            { productId: product1.id.id},
            { productId: product2.id.id},
        ]);
    });

    it("should be approved", async () => {
        const props = {
            checkouRepository: new CheckoutRepository(),
            clientFacade: ClientAdmFacadeFactory.create(), 
            productFacade: ProductAdmfacadeFatory.create(),
            catalogFacade: StoreCatalogFacadeFactory.create(),
            invoiceFacade: InvoiceFacadeFactory.create(),
            paymentFacade: PaymentFacadeFactory.create(),
        }

        const placeOrderUseCase = new PlaceOrderUseCase(
            props.clientFacade,
            props.productFacade,
            props.catalogFacade,
            props.checkouRepository,
            props.invoiceFacade,
            props.paymentFacade,
        );

        const input: PlaceOrderCheckoutFacadeInputDto = {
            clientId: client.id.id,
            products: [{ productId: product1.id.id }, { productId: product2.id.id }, { productId: product3.id.id }],
        }

        let output = await placeOrderUseCase.execute(input);

        expect(output.id).toBeDefined();
        expect(output.invoiceId).toBeDefined();
        expect(output.status).toEqual("approved");
        expect(output.total).toBe(110);
        
        expect(output.products).toStrictEqual([
            { productId: product1.id.id},
            { productId: product2.id.id},
            { productId: product3.id.id},
        ]);
    });
});