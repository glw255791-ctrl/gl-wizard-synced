import "@/index.css";
import { Source_Sans_3 } from "next/font/google";
import { Providers } from "@/components/providers";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={sourceSans.variable}>
      <body className={sourceSans.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
