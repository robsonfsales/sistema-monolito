export interface FindClientInputDto {
    id: string;
}

export interface findClientOutputDto {
    id: string;
    name: string;
    email: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}