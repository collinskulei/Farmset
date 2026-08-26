import { FarmProvider } from "@/components/site/farm-context";
import { TourProvider } from "@/components/site/tour-context";
import { TourOverlay } from "@/components/site/tour-overlay";
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
      <TourProvider>
        <Header />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <div className="hidden md:block">
          <Footer />
        </div>
        <BottomNav />
        <TourOverlay />
      </TourProvider>
    </FarmProvider>
  );
}
