import Providers from "@/components/Providers";
import Chat from "@/components/Chat";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bookfinder",
  description: "Your favorite bookstore!",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>
          <Chat />
          {children}
        </body>
      </Providers>
    </html>
  );
};
export default RootLayout;
