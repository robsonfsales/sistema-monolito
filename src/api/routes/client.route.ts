import express, {Request, Response} from "express";
import ClientRepository from "../../modules/client-adm/repository/client.repository";
import AddClientUseCase from "../../modules/client-adm/usecase/add-client/add-client.usecase";
import FindClientUseCase from "../../modules/client-adm/usecase/find-client/find-client.usecase";

export const clientRoute = express.Router();

clientRoute.post('/', async (req: Request, res: Response) => {
    const useCase = new AddClientUseCase(new ClientRepository());

    try {
        const inputDto = {
            name: req.body.name,
            document: req.body.document,
            email: req.body.email,
            street: req.body.street,
            number: req.body.number,
            complement: req.body.complement,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode,
        }

        const output = await useCase.execute(inputDto);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});

clientRoute.get('/:clientId', async (req: Request, res: Response) => {
    const useCase = new FindClientUseCase (new ClientRepository());

    try {
        const inputDto = {
            id: req.params.clientId,
        }
        const output = await useCase.execute(inputDto);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});