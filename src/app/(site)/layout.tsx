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
      <main>
        {children}
      </main>
      <GlobalPlayerBar />
      <Footer />
    </PlayerProvider>
  );
}
