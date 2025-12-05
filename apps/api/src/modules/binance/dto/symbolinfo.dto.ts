import { IsArray, IsEnum, IsNumber, IsString } from "class-validator";
import { OrderType, TradeStatus } from "../../../common/enums/binance.enums";


export class SymbolInfoDto {
    @IsString()
    symbol: string;

    @IsEnum(TradeStatus)
    status: TradeStatus;

    @IsString()
    baseAsset: string;

    @IsNumber()
    baseAssePrecision: number;

    @IsString()
    quoteAsset: string;

    @IsNumber()
    quoteAssetPrecision: number;

    @IsNumber()
    baseCommissionPrecision: number;

    @IsNumber()
    quoteCommissionPrecision: number;

    @IsArray()
    orderTypes: OrderType[]
}