import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenereateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";

export default class InvoiceFacadeFactory {
    static create() {
        // criar repositorio
        const repository = new InvoiceRepository();

        // criar usecase e injetar repositorio no usecase
        const generateUseCase = new GenereateInvoiceUseCase(repository);
        const findUseCase = new FindInvoiceUseCase(repository);
        
        // criar facade e injetar o caso de uso na facade
        const facade = new InvoiceFacade({
            generateUseCase: generateUseCase,
            findUseCase: findUseCase,
        });

        return facade;
    }
}