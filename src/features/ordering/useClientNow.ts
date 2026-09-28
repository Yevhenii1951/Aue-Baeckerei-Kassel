"use client";

import { useSyncExternalStore } from "react";

function subscribeNothing(): () => void {
  return () => {};
}

let clientNow: Date | null = null;

export function useClientNow(): Date | null {
  return useSyncExternalStore<Date | null>(
    subscribeNothing,
    () => {
      clientNow ??= new Date();
      return clientNow;
    },
    () => null,
  );
}