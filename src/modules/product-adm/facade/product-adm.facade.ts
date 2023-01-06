import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import ProductAdmFacadeInterface, { AddProductFacadeInputDto, CheckStockFacadeInputDto, CheckStockFacadeOutputDto } from "./product-adm.facade.interface";

export interface UseCasesProps {
    addUseCase: UseCaseInterface;
    stockUseCase: UseCaseInterface;
}

export default class ProductAdmFacade implements ProductAdmFacadeInterface {

    private _addUseCase: UseCaseInterface;
    private _checkStockUsecase: UseCaseInterface;

    constructor(useCaseProps: UseCasesProps) {
        this._addUseCase = useCaseProps.addUseCase;
        this._checkStockUsecase = useCaseProps.stockUseCase;
    }

    addProduct(input: AddProductFacadeInputDto): Promise<void> {
        // caso do dto do caso de uso for diferente do dto da facade, converter o dto do facade para o dto do caso de uso
        return this._addUseCase.execute(input);
    }

    checkStock(input: CheckStockFacadeInputDto): Promise<CheckStockFacadeOutputDto> {
        return this._checkStockUsecase.execute(input);
    } 
}