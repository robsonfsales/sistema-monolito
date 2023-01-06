import AddProductUseCase from "./add-product.usecase";

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn(),
    };
};

describe("Add Product usecase unit test", () => {
    it("should add a product", async () => {
        // repositorio
        const productRepository = MockRepository();
        
        // input
        const input = {
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 100,
            stock: 10,
        };

        // usecase
        const addProductUseCase = new AddProductUseCase(productRepository);
        
        // output
        const result = await addProductUseCase.execute(input);

        expect(productRepository.add).toHaveBeenCalled();
        expect(result.id).toBeDefined;
        expect(result.name).toBe(input.name);
        expect(result.description).toBe(input.description);
        expect(result.purchasePrice).toBe(input.purchasePrice);
        expect(result.stock).toBe(input.stock);        
    });
});