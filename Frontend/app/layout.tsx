import "./globals.css";
import { Toaster } from "sonner";
import localFont from "next/font/local";
import Providers from "@/components/Providers";
import { SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header";

const monaSans = localFont({
  src: [
    {
      path: "../public/fonts/MonaSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/MonaSans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/MonaSans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-mona-sans",
});

export const metadata = {
  title: "BlockedLearning",
  description: "Blockchain-powered learning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={monaSans.variable} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <Providers>
          <AppSidebar />
          <SidebarInset>
            <Header />
            <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {children}
            </main>
            <Toaster richColors closeButton />
          </SidebarInset>
        </Providers>
      </body>
    </html>
  );
}
