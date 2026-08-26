import { Space_Grotesk, Roboto } from "next/font/google";
import localFont from "next/font/local";
import { siteConfig } from "@/data/site";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const microphoneCheck = localFont({
  src: "../fonts/Microphone-Check.woff2",
  variable: "--font-microphone",
  display: "swap",
});

export const metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${roboto.variable} ${microphoneCheck.variable}`}
    >
      <body className="bg-background text-foreground font-sans antialiased overflow-x-hidden">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
