"use client";

import { useRef, type ReactNode } from "react";

export function ServiceRow({ children }: { children: ReactNode }) {
  const preview = useRef(false);

  return <details className="service"
    onPointerEnter={(event) => {
      if (event.pointerType !== "mouse" || event.currentTarget.open) return;
      preview.current = true;
      event.currentTarget.open = true;
    }}
    onPointerLeave={(event) => {
      if (!preview.current) return;
      preview.current = false;
      if (!event.currentTarget.contains(document.activeElement)) event.currentTarget.open = false;
    }}
    onClick={(event) => {
      if (!preview.current || !(event.target as Element).closest("summary")) return;
      preview.current = false;
      event.preventDefault();
    }}>{children}</details>;
}
