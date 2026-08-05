import type { ReactNode } from "react";

import "@/app/globals.css";

export default function EntryLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
