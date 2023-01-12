import express, {Request, Response} from "express";
import PlaceOrderUseCase from "../../modules/checkout/usecase/place-order/place-order.usecase";
import ClientAdmFacadeFactory from "../../modules/client-adm/factory/client-adm.facade.factory";
import ProductAdmfacadeFatory from "../../modules/product-adm/factory/product-adm.facade.factory";
import StoreCatalogFacadeFactory from "../../modules/store-catalog/factory/store-catalog.facade.factory";
import InvoiceFacadeFactory from "../../modules/invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../modules/payment/factory/payment.facade.factory";
import CheckoutRepository from "../../modules/checkout/repository/checkout.repository";

export const checkoutRoute = express.Router();

checkoutRoute.post('/', async (req: Request, res: Response) => {

    const props = {
        checkouRepository: new CheckoutRepository(),
        clientFacade: ClientAdmFacadeFactory.create(), 
        productFacade: ProductAdmfacadeFatory.create(),
        catalogFacade: StoreCatalogFacadeFactory.create(),
        invoiceFacade: InvoiceFacadeFactory.create(),
        paymentFacade: PaymentFacadeFactory.create(),
    }

    const useCase = new PlaceOrderUseCase(
        props.clientFacade,
        props.productFacade,
        props.catalogFacade,
        props.checkouRepository,
        props.invoiceFacade,
        props.paymentFacade,
    );

    try {
        const inputDto = {
            clientId: req.body.clientId,
            products: req.body.products.map((product: { productId: string; }) => {
                let products = {
                    productId: product.productId,     
                };
                return products;
            }),
        }

        const output = await useCase.execute(inputDto);
        res.send(output);
        
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});