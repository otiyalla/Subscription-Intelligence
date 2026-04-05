"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { type ReactNode, createContext, useContext, useState } from "react";
import { Toaster } from "sonner";

type RuntimeMode = "demo" | "live";

type AppRuntimeContextValue = {
  mode: RuntimeMode;
};

const AppRuntimeContext = createContext<AppRuntimeContextValue>({
  mode: "demo",
});

export function useAppRuntime() {
  return useContext(AppRuntimeContext);
}

type AppProvidersProps = {
  children: ReactNode;
  mode: RuntimeMode;
};

export function AppProviders({ children, mode }: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 60_000,
            retry: false,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  return (
    <AppRuntimeContext.Provider value={{ mode }}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster richColors position="top-right" />
        </QueryClientProvider>
      </ThemeProvider>
    </AppRuntimeContext.Provider>
  );
}
