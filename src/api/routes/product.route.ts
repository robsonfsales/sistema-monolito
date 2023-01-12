import express, {Request, Response} from "express";
import AddProductUseCase from "../../modules/product-adm/usecase/add-product/add-product.usecase";
import ProductRepository from "../../modules/product-adm/repository/product.repository";
import CheckStockUseCase from "../../modules/product-adm/usecase/check-stock/check-stock.usecase";

export const productRoute = express.Router();

productRoute.post('/', async (req: Request, res: Response) => {
    const useCase = new AddProductUseCase(new ProductRepository());

    try {
        const inputDto = {
            name: req.body.name,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice,
            stock: req.body.stock,
        }

        const outputDto = await useCase.execute(inputDto);
        res.send(outputDto);
    } catch (err) {
        res.status(500).send(err);
    }
});

productRoute.get('/:productId', async (req: Request, res: Response) => {
    const useCase = new CheckStockUseCase (new ProductRepository());

    try {
        const inputDto = {
            productId: req.params.productId,
        }
        const outputDto = await useCase.execute(inputDto);
        res.send(outputDto);
    } catch (err) {
        res.status(500).send(err);
    }
});