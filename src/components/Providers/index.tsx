"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LightDarkModeProvider } from "./LightDarkModeProvider";
import UIProvider from "./UIProvider";

function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <LightDarkModeProvider>
        <UIProvider>{children}</UIProvider>
      </LightDarkModeProvider>
    </QueryClientProvider>
  );
}

export default Providers;
