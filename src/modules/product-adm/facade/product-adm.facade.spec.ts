import { Sequelize } from "sequelize-typescript";
import ProductModel from "../repository/product.model";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../usecase/add-product/add-product.usecase";
import ProductAdmFacade from "./product-adm.facade";
import ProductAdmfacadeFatory from "../factory/product-adm.facade.factory";

describe("ProductAdmFacade test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        // criar repositorio
        // criar usecase
        // injetar repositorio no usecase
        // criar facade
        // injetar o caso de uso na facade

        // const productRepository = new ProductRepository();
        // const addProductUseCase = new AddProductUseCase(productRepository);
        // const productFacade = new ProductAdmFacade({
        //     addUseCase: addProductUseCase,
        //     stockUseCase: undefined,
        // });

        const productFacade = ProductAdmfacadeFatory.create();

        const input = {
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            stock: 10,
            purchasePrice: 100,
        };

        await productFacade.addProduct(input);

        const product = await ProductModel.findOne( { where: { id: "1" } } );

        expect(product).toBeDefined();
        expect(product.id).toBe(input.id)
        expect(product.name).toBe(input.name);
        expect(product.description).toBe(input.description);
        expect(product.purchasePrice).toBe(input.purchasePrice);
        expect(product.stock).toBe(input.stock); 

    });

    it("should check product stock", async () => {

        const productFacade = ProductAdmfacadeFatory.create();

        const input = {
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            stock: 10,
            purchasePrice: 100,
        };

        await productFacade.addProduct(input);

        const result = await productFacade.checkStock({ productId: "1" });

        expect(result.productId).toBe(input.id);
        expect(result.stock).toBe(input.stock);


    });

});