import { Footer } from "@/components/Footer";
import { BlogPickupSection } from "@/components/home/BlogPickupSection";
import { HomeTabsClient } from "@/components/home/HomeTabsClient";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5">
        <HomeTabsClient />
        <BlogPickupSection />
      </main>

      <Footer />
    </div>
  );
}
