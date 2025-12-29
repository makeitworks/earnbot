"use client";

import { useEffect } from "react";
import { getMarketSocket } from "@/lib/socket";
import { useQueryClient } from "@tanstack/react-query";
import { StateKeys } from "@/lib/state-key";

export function MarketSocketProvider() {
    const queryClient = useQueryClient();

    useEffect( ()=> {
        const socket = getMarketSocket();
        socket.connect();

        socket.on("connect", ()=> {
            console.log("socket connected");
        });

        socket.on("miniTicker", ( data )=> {
            queryClient.setQueryData([StateKeys.MINI_TICKER],data)
        })
    },[queryClient])
}