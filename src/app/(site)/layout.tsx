import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlobalPlayerBar from "@/components/GlobalPlayerBar";
import { PlayerProvider } from "@/lib/PlayerContext";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PlayerProvider>
      <Navigation />
      <main className="min-h-screen pt-40 pb-20">
        {children}
      </main>
      <GlobalPlayerBar />
      <Footer />
    </PlayerProvider>
  );
}
