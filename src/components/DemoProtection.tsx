"use client";

import { ReactNode } from "react";

export default function DemoProtection({ children }: { children: ReactNode }) {
  return (
    <div
      className="demo-protected"
      onContextMenu={(event) => event.preventDefault()}
      onCopy={(event) => event.preventDefault()}
      onCut={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
    >
      {children}
    </div>
  );
}
