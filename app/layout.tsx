import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import { AppShell } from "@/components/AppShell/AppShell";
import { ExpensesProvider } from "@/hooks/useExpenses";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "DOM — budżet wykończenia",
  description: "Pracownia budżetu wykończenia domu.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={`${geistSans.variable} ${fraunces.variable}`}>
      <body>
        <ExpensesProvider>
          <AppShell>{children}</AppShell>
        </ExpensesProvider>
      </body>
    </html>
  );
}
