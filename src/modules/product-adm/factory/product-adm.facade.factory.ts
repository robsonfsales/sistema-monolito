import ProductAdmFacade from "../facade/product-adm.facade";
import ProductAdmFacadeInterface from "../facade/product-adm.facade.interface";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../usecase/add-product/add-product.usecase";
import CheckStockUseCase from "../usecase/check-stock/check-stock.usecase";

export default class ProductAdmfacadeFatory {
    static create(): ProductAdmFacadeInterface {
        const repository = new ProductRepository();
        const addUseCase = new AddProductUseCase(repository);
        const stockUseCase = new CheckStockUseCase(repository);

        const facade = new ProductAdmFacade({
            addUseCase: addUseCase,
            stockUseCase: stockUseCase,
        });

        return facade;
    }
}