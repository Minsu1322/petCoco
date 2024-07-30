"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { SocketProvider } from "@/components/provider/SocketProvider";
import NextAuthProvider from "@/components/provider/NextAuthProvider";

const QueryProvider = ({ children }: React.PropsWithChildren) => {
  const queryClient = new QueryClient();

  return (
    <SessionProvider>
      <NextAuthProvider>
        <SocketProvider>
          <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </SocketProvider>
      </NextAuthProvider>
    </SessionProvider>
  );
};

export default QueryProvider;
