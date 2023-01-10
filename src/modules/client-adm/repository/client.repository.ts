import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import ClientGateway from "../gateway/client.gateway";
import Address from "../value-object/Address";
import { ClientModel } from "./client.model";

export default class ClientRepository implements ClientGateway {

    async add(client: Client): Promise<void> {
        await ClientModel.create({
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
            address: new Address({
                street: clientModel.street,
                number: clientModel.number,
                complement: clientModel.complement,
                city: clientModel.city,
                state: clientModel.state,
                zipCode: clientModel.zipCode,
            }),
            createdAt: clientModel.createdAt,
            updatedAt: clientModel.updatedAt,
        });
    }

}