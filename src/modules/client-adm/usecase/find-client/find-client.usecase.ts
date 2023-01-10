import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientGateway from "../../gateway/client.gateway";
import { FindClientInputDto, findClientOutputDto } from "./find-client.usecase.dto";

export default class FindClientUseCase implements UseCaseInterface {
    private _clientRepository: ClientGateway;

    constructor(clientRepository: ClientGateway) {
        this._clientRepository = clientRepository;
    }

    async execute(input: FindClientInputDto): Promise<findClientOutputDto> {
        
        const client = await this._clientRepository.find(input.id);

        return {
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
        };
    }
}