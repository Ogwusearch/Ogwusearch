import type { ReactNode } from "react";

import { Footer } from "./Footer";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="site">
      <Header />

      <main className="site-main">
        {children}
      </main>

      <Footer />
    </div>
  );
}
