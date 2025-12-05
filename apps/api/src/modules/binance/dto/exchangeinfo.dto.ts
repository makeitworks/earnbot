import { IsArray, IsNumber, IsString } from "class-validator";
import { SymbolInfoDto } from "./symbolinfo.dto";

export class ExchangeInfoDto {
    @IsString()
    timezone: string;

    @IsNumber()
    serverTime: number;

    @IsArray()
    symbols: SymbolInfoDto[]
}