import { ExChangeEnum, TradeType } from "../common";

export async function getTradingPair(exchange: ExChangeEnum, tradeType: TradeType ) {
    const params = new URLSearchParams({
        exchange, tradeType
    });

    const res = await fetch(`http://localhost:4000/market/pairs?${params}`);
    if(!res.ok) {
        throw new Error(res.statusText);
    }
    return res.json();
}