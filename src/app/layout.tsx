import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LAL DIVANE",
  description: "Digital Ritual Protocol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;600&family=Inter:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-void-deep text-soft">
        {children}
      </body>
    </html>
  );
}
