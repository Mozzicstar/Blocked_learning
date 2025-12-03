import { SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header";
import Aurora from "@/components/Aurora";
import DynamicBreadcrumbs from "@/components/DynamicBreadcrumbs";

export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <DynamicBreadcrumbs />

        <main className="flex flex-1 flex-col gap-4 p-4 pt-0 relative">
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40">
            <Aurora speed={0.5} />
          </div>
          {children}
        </main>
      </SidebarInset>
    </>
  );
}
