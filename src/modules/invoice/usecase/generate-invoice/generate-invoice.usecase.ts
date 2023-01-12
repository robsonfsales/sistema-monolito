import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Invoice from "../../domain/invoice.entity";
import Product from "../../domain/product.entity";
import InvoiceGateway from "../../gateway/Invoice.gateway";
import Address from "../../value-object/Address";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.dto";

export default class GenereateInvoiceUseCase implements UseCaseInterface {
    private _repository: InvoiceGateway;

    constructor(repository: InvoiceGateway) {
        this._repository = repository;
    }

    async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {

        const entityInput = new Invoice({
            name: input.name,
            document: input.document,
            address: new Address({
                street: input.street,
                number: input.number,
                complement: input.complement,
                city: input.city,
                state: input.state,
                zipCode: input.zipCode,
            }),
            items: input.items.map((item) => {
                let items = new Product({
                    id: new Id(item.id),
                    name: item.name,
                    price: item.price,
                });
                return items;
            }),
        });

        const entityOutput = await this._repository.generate(entityInput);

        return {
            id: entityOutput.id.id,
            name: entityOutput.name,
            document: entityOutput.document,
            street: entityOutput.address.street,
            number: entityOutput.address.number,
            complement: entityOutput.address.complement,
            city: entityOutput.address.city,
            state: entityOutput.address.state,
            zipCode: entityOutput.address.zipCode,
            items: entityOutput.items.map((item) => {
                let items = {
                    id: item.id.id,
                    name: item.name,
                    price: item.price,
                }
                return items;
            }),
            total: entityOutput.total(),
        }
    }
}