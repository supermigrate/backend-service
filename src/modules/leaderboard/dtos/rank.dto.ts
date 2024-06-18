import {
    IsEthereumAddress,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString
} from 'class-validator';

export class RankInitDto {
    @IsNotEmpty()
    @IsEthereumAddress()
    token_address: string;


    @IsNotEmpty()
    incentives: IncentiveDto[]
}

export class IncentiveDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;


    @IsNotEmpty()
    actions: string[]
}


export class UpdateIncentiveDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;


    @IsNotEmpty()
    actions: ActionDto[]
}


export class ActionDto {
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    is_active: boolean
}

export class PaginateDto {
    @IsOptional()
    @IsString()
    take = '50';

    @IsOptional()
    @IsString()
    skip = '0';
}
