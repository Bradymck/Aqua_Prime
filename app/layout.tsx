import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GlobalStyle } from "./styles/GlobalStyle";
import { StyledComponentsRegistry } from "./lib/styled-components";
import "@/private/styles/globals.css";
import { Providers } from "./providers";
import { Toaster } from "./components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Platypus Passions",
  description: "Web3 Dating App for Platypus Enthusiasts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <GlobalStyle />
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}