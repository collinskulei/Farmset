import { FarmProvider } from "@/components/site/farm-context";
import { Header } from "@/components/site/header";
import { BottomNav } from "@/components/site/bottom-nav";
import { Footer } from "@/components/site/footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FarmProvider>
      <Header />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <div className="hidden md:block">
        <Footer />
      </div>
      <BottomNav />
    </FarmProvider>
  );
}
