export const KeyDefaultExpireInSec = 172800; // 2天过期

export enum KeyPrefix {
    // 币安交易所
    BINANCE_SPOT_SYMBOL = 'Binance:SpotSymbol', // 现货交易对
    BINANCE_CMF_SYMBOL = 'Binance:CMFSymbol',   // 币本位合约交易对

    BINANCE_SPOT_BOOK_TICKER = 'Binance:SpotBookTicker', // 现货交易对BookTicker
    BINANCE_CMF_BOOK_TICKER = 'Binance:CMFBookTicker', // 币本位合约交易对BookTicker

}