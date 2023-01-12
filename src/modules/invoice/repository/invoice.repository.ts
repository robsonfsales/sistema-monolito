import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import Product from "../domain/product.entity";
import InvoiceGateway from "../gateway/Invoice.gateway";
import Address from "../value-object/Address";
import InvoiceModel from "./invoice.model";
import ProductModel from "./invoice-item.model";

export default class InvoiceRepository implements InvoiceGateway {

    async generate(entity: Invoice): Promise<Invoice> {
        
        const invoiceModel = await InvoiceModel.create({
            id: entity.id.id,
            name: entity.name,          
            document: entity.document,
            street: entity.address.street,
            number: entity.address.number,
            complement: entity.address.complement,
            city: entity.address.city,
            state: entity.address.state,
            zipCode: entity.address.zipCode,
            items: entity.items.map((item) => ({
                id: new Id().id,
                productId: item.id.id,
                name: item.name,
                price: item.price
            })), 
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        },
        {
            include: [{model: ProductModel}],
        });

        const invoice = new Invoice({
            id: new Id(invoiceModel.id), 
            name: invoiceModel.name,
            document: invoiceModel.document,
            address: new Address ({
                street: invoiceModel.street,
                number: invoiceModel.number,
                complement: invoiceModel.complement,
                city: invoiceModel.city,
                state: invoiceModel.state,
                zipCode: invoiceModel.zipCode,
            }),
            items: invoiceModel.items.map((item) => {
                let items = new Product({
                    id: new Id(item.productId),
                    name: item.name,
                    price: item.price,
                });
                return items;
            }),
            createdAt: invoiceModel.createdAt,
            updatedAt: invoiceModel.updatedAt,
        });

        return invoice;
    }

    async find(id: string): Promise<Invoice> {

        const invoiceModel = await InvoiceModel.findOne({ 
            where : { id },
            include: ["items"],
        });

        if(!invoiceModel) {
            throw new Error("Invoice not found");
        }

        return new Invoice({
            id: new Id(invoiceModel.id), 
            name: invoiceModel.name,
            document: invoiceModel.document,
            address: new Address({
                street: invoiceModel.street,
                number: invoiceModel.number,
                complement: invoiceModel.complement,
                city: invoiceModel.city,
                state: invoiceModel.state,
                zipCode: invoiceModel.zipCode,
            }),
            items: invoiceModel.items.map((item) => {
                let items = new Product({
                                id: new Id(item.productId),
                                name: item.name,
                                price: item.price,
                            });
                return items;
            }),
            createdAt: invoiceModel.createdAt,
            updatedAt: invoiceModel.updatedAt,
        });
    }

}