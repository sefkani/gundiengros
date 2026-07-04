"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/types";

export interface CartLine {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  setQuantity: (product: Product, quantity: number) => void;
  removeLine: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalExVat: number;
  totalVat: number;
  totalIncVat: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "gundi-engros-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  function setQuantity(product: Product, quantity: number) {
    setLines((prev) => {
      const existing = prev.find((l) => l.product.id === product.id);
      if (quantity <= 0) {
        return prev.filter((l) => l.product.id !== product.id);
      }
      if (existing) {
        return prev.map((l) =>
          l.product.id === product.id ? { ...l, quantity } : l
        );
      }
      return [...prev, { product, quantity }];
    });
  }

  function removeLine(productId: string) {
    setLines((prev) => prev.filter((l) => l.product.id !== productId));
  }

  function clearCart() {
    setLines([]);
  }

  const totals = useMemo(() => {
    const totalItems = lines.reduce((sum, l) => sum + l.quantity, 0);
    const totalExVat = lines.reduce(
      (sum, l) => sum + l.quantity * l.product.price_ex_vat,
      0
    );
    const totalVat = lines.reduce(
      (sum, l) =>
        sum + l.quantity * l.product.price_ex_vat * (l.product.vat_rate / 100),
      0
    );
    return { totalItems, totalExVat, totalVat, totalIncVat: totalExVat + totalVat };
  }, [lines]);

  return (
    <CartContext.Provider
      value={{ lines, setQuantity, removeLine, clearCart, ...totals }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart må brukes innenfor <CartProvider>");
  return ctx;
}
