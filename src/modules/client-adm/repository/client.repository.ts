import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import ClientGateway from "../gateway/client.gateway";
import { ClientModel } from "./client.model";

export default class ClientRepository implements ClientGateway {

    async add(client: Client): Promise<void> {
        await ClientModel.create({
            id: client.id.id,           
            name: client.name,
            document: client.document,
            email: client.email,
            street: client.street,
            number: client.number,
            complement: client.complement,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        });
    }
    
    async find(id: string): Promise<Client> {
        const clientModel = await ClientModel.findOne({ where : { id } });

        if(!clientModel) {
            throw new Error("Client not found");
        }

        return new Client({
            id: new Id(clientModel.id),          
            name: clientModel.name,
            document: clientModel.document,
            email: clientModel.email,
            street: clientModel.street,
            number: clientModel.number,
            complement: clientModel.complement,
            city: clientModel.city,
            state: clientModel.state,
            zipCode: clientModel.zipCode,
            createdAt: clientModel.createdAt,
            updatedAt: clientModel.updatedAt,
        });
    }

}