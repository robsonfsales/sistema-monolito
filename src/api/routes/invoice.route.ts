import express, {Request, Response} from "express";
import InvoiceRepository from "../../modules/invoice/repository/invoice.repository";
import GenereateInvoiceUseCase from "../../modules/invoice/usecase/generate-invoice/generate-invoice.usecase";
import FindInvoiceUseCase from "../../modules/invoice/usecase/find-invoice/find-invoice.usecase";

export const invoiceRoute = express.Router();

invoiceRoute.post('/', async (req: Request, res: Response) => {
    const useCase = new GenereateInvoiceUseCase(new InvoiceRepository());

    try {
        const inputDto = {
            name: req.body.name,
            document: req.body.document,
            street: req.body.street,
            number: req.body.number,
            complement: req.body.complement,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode,
            items: req.body.items.map((item: { id: string; name: string; price: number; }) => {
                let items = {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                }
                return items;
            }),
        }

        const output = await useCase.execute(inputDto);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});

invoiceRoute.get('/:invoiceId', async (req: Request, res: Response) => {
    const useCase = new FindInvoiceUseCase (new InvoiceRepository());

    try {
        const inputDto = {
            id: req.params.invoiceId,
        }
        const output = await useCase.execute(inputDto);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});