import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import FloatingActions from "@/components/FloatingActions";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Samskriti Interiors | Luxury Interior Design Studio",
  description:
    "Samskriti Interiors crafts timeless spaces where architecture meets emotion — an award-winning luxury interior design studio.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${manrope.variable} h-full`}
    >
      <body className="min-h-full bg-ivory text-ink antialiased cursor-none-fine">
        <div className="noise-overlay" />
        <CustomCursor />
        <SmoothScroll>
          {children}
          <FloatingActions />
        </SmoothScroll>
      </body>
    </html>
  );
}
