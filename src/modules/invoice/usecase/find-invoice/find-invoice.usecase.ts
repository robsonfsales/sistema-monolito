import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import InvoiceGateway from "../../gateway/Invoice.gateway";
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "./find-invoice.dto";

export default class FindInvoiceUseCase implements UseCaseInterface {

    private _repository: InvoiceGateway;

    constructor(repository: InvoiceGateway) {
        this._repository = repository;
    }

    async execute(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
        const invoice = await this._repository.find(input.id);

        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            address: {
                street: invoice.address.street,
                number: invoice.address.number,
                complement: invoice.address.complement,
                city: invoice.address.city,
                state: invoice.address.state,
                zipCode: invoice.address.zipCode,
            },
            items: invoice.items.map((item) => {
                let items = {
                    id : item.id.id,
                    name: item.name,
                    price: item.price,
                }
                return items;
            }),
            total: invoice.total(),
            createdAt: invoice.createdAt,
        }
    }
    
}