"use client";

import {
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Product } from "@/features/catalog/types";
import {
  calculateCart,
  setCartItemQuantity,
  type CartItemInput,
} from "./cart";
import {
  CART_STORAGE_KEY,
  parseCartStorage,
  serializeCart,
} from "./cartStorage";

type Snapshot = {
  items: CartItemInput[];
  isOpen: boolean;
};

const emptySnapshot: Snapshot = { items: [], isOpen: false };

let snapshot: Snapshot = emptySnapshot;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Snapshot {
  return snapshot;
}

function getServerSnapshot(): Snapshot {
  return emptySnapshot;
}

function persist(items: CartItemInput[]): void {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, serializeCart(items));
  } catch {
    // storage unavailable (private mode, quota) — cart stays in memory
  }
}

function updateItems(items: CartItemInput[]): void {
  snapshot = { ...snapshot, items };
  emit();
  persist(items);
}

export function addToCart(product: Product): void {
  const existing = snapshot.items.find(
    (item) => item.productId === product.id,
  );
  const items = existing
    ? setCartItemQuantity(snapshot.items, product.id, existing.quantity + 1)
    : [
        ...snapshot.items,
        {
          productId: product.id,
          name: product.name,
          category: product.category,
          unitPriceCents: product.priceCents,
          quantity: 1,
        },
      ];
  updateItems(items);
}

export function changeQuantity(productId: string, quantity: number): void {
  updateItems(setCartItemQuantity(snapshot.items, productId, quantity));
}

export function openCart(): void {
  snapshot = { ...snapshot, isOpen: true };
  emit();
}

export function closeCart(): void {
  snapshot = { ...snapshot, isOpen: false };
  emit();
}

export function useCart() {
  const { items, isOpen } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return {
    items,
    isOpen,
    totals: calculateCart(items, { breakfastBundle: true }),
    addToCart,
    changeQuantity,
    openCart,
    closeCart,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    let loaded: CartItemInput[];
    try {
      loaded = parseCartStorage(
        window.localStorage.getItem(CART_STORAGE_KEY),
      );
    } catch {
      loaded = [];
    }
    if (loaded.length > 0) {
      snapshot = { ...snapshot, items: loaded };
      emit();
    }
  }, []);

  return <>{children}</>;
}