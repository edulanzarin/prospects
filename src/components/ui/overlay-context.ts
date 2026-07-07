"use client";

import { createContext, useContext } from "react";

export const OverlayCloseContext = createContext<(() => void) | null>(null);

/** Fecha o overlay (drawer ou modal) com animação se estiver dentro de um; fora, retorna null. */
export function useOverlayClose() {
  return useContext(OverlayCloseContext);
}
