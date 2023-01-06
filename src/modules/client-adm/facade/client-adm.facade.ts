import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface, { AddClientFacadeInputDto, FindClientFacadeInputDto, findClientFacadeOutputDto } from "./client-adm.facade.interface";

export interface UseCasesProps {
    addUseCase: UseCaseInterface;
    findUseCase: UseCaseInterface;
}

export default class ClientAdmFacade implements ClientAdmFacadeInterface {

    private _addUsecase: UseCaseInterface;
    private _findUsecase: UseCaseInterface;

    constructor(usecaseProps: UseCasesProps) {
        this._addUsecase = usecaseProps.addUseCase;
        this._findUsecase = usecaseProps.findUseCase;
    }


    async add(input: AddClientFacadeInputDto): Promise<void> {
        await this._addUsecase.execute(input);
    }

    async find(input: FindClientFacadeInputDto): Promise<findClientFacadeOutputDto> {
        const result = await this._findUsecase.execute(input);

        return {
            id: result.id,
            name: result.name,
            email: result.email,
            address: result.address,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
        }
    }

}