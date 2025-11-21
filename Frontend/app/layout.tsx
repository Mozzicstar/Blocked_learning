import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import WalletProvider from "@/lib/wallet";

export const metadata = {
  title: "BlockedLearning",
  description: "Blockchain-powered learning platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <WalletProvider>
          <Navbar />
          <main className="max-w-6xl mx-auto px-4 py-8">
            {children}
          </main>
          <Toaster richColors closeButton />
        </WalletProvider>
      </body>
    </html>
  );
}
