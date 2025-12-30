"use client";

import { useEffect } from "react";
import { getMarketSocket } from "@/lib/socket";
import { useQueryClient } from "@tanstack/react-query";
import { WSEvents } from "@/lib/websocket-events";
import { ExChangeEnum, StateKey } from "@/lib/common";
import { json } from "stream/consumers";

export function MarketSocketProvider() {
  const queryClient = useQueryClient();

  const binanceSpotPriceMap = new Map<string, string>();
  const binanceCMFPriceMap = new Map<string, string>();

  useEffect(() => {
    const socket = getMarketSocket();
    socket.connect();

    socket.on("connect", () => {
      console.log("socket connected");
    });

    socket.on(WSEvents.BINANCE_MINI_TICKER_SPOT, (_data) => {
      let payload = JSON.parse(_data);
      payload.data.forEach((item: any) => {
        const lastPrice = binanceSpotPriceMap.get(item.s);
        if (lastPrice === item.c) {
          return;
        }

        binanceSpotPriceMap.set(item.s, item.c);

        queryClient.setQueryData(
          [StateKey.PRICE, ExChangeEnum.BINANCE, item.s],
          (old: any) => {
            if (!old) return item;

            if (old.c === item.c) {
              return old; // price not changed, do nothing.
            }

            return {
              ...old,
              E: item.E,
              c: item.c,
              o: item.c,
              h: item.h,
              l: item.h,
              v: item.v,
              q: item.q,
            };
          }
        );
      });
    });

    socket.on(WSEvents.BINANCE_MINI_TICKER_CMF, (_data) => {
      let payload = JSON.parse(_data);
      payload.data.forEach((item: any) => {
        const lastPrice = binanceCMFPriceMap.get(item.s);
        if (lastPrice === item.c) {
          return;
        }
        binanceCMFPriceMap.set(item.s, item.c);

        queryClient.setQueryData(
          [StateKey.PRICE, ExChangeEnum.BINANCE, item.s],
          (old: any) => {
            if (!old) {
              return item;
            }

            if (old.c === item.c) {
              return old; // price not changed, do nothing.
            }
            return {
              ...old,
              E: item.E,
              c: item.c,
              o: item.o,
              h: item.h,
              l: item.l,
              v: item.v,
              q: item.q,
            };
          }
        );
      });
    });
  }, [queryClient]);

  return null;
}
