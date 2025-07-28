"use client";

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactNode } from "react";

import { CartProvider } from "../lib/cartContext";
import { ModalProvider } from "@/lib/modalContext";
import { OrderIdProvider } from "@/lib/orderIdContext";
import { MenuProvider } from "@/lib/menuContext";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient(): QueryClient {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <MenuProvider>
        <CartProvider>
          <OrderIdProvider>
            <ModalProvider>{children}</ModalProvider>
          </OrderIdProvider>
        </CartProvider>
      </MenuProvider>
    </QueryClientProvider>
  );
}
