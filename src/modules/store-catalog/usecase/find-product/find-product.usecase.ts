import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ProductGateway from "../../gateway/product.gateway";
import { FindProductInputDto, FindProductOuputDto } from "./find-product.dto";

export default class FindProductUseCase implements UseCaseInterface {
    constructor(private readonly productRepository: ProductGateway){}

    async execute(input: FindProductInputDto): Promise<FindProductOuputDto> {
        const product = await this.productRepository.find(input.id);

        return {
            id: product.id.id,
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice,
        }
    }
}