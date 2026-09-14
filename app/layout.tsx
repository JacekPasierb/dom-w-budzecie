import { plPL } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import { AppShell } from "@/components/AppShell/AppShell";
import { ExpensesProvider } from "@/hooks/useExpenses";
import { clerkAppearance } from "@/lib/clerkAppearance";
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
  title: "Dom w budżecie",
  description: "Pomaga zmieścić się w budżecie przy wykończeniu domu.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={`${geistSans.variable} ${fraunces.variable}`}>
      <body>
        <ClerkProvider localization={plPL} appearance={clerkAppearance}>
          <ExpensesProvider>
            <AppShell>{children}</AppShell>
          </ExpensesProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
