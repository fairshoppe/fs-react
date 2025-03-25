"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/contexts/CartContext";
import ThemeRegistry from "@/theme/ThemeRegistry";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={0}>
      <ThemeRegistry>
        <CartProvider>{children}</CartProvider>
      </ThemeRegistry>
    </SessionProvider>
  );
} 