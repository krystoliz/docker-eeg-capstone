import type { Metadata } from "next";
// 1. Import all three fonts
import { Inter, Abril_Fatface, Aref_Ruqaa } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

// 2. Configure Inter (Body font)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// 3. Configure Abril Fatface (Logo font)
const abril = Abril_Fatface({
  weight: "400", // Abril only has weight 400
  subsets: ["latin"],
  variable: "--font-abril",
  display: "swap",
});

// 4. Configure Aref Ruqaa (Subtitle font)
const aref = Aref_Ruqaa({
  weight: ["400", "700"], // Standard weights
  subsets: ["latin"],
  variable: "--font-aref",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Affectra",
  description: "EEG Emotion Monitoring System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 5. Apply ALL font variables to the body */}
      {/* We also add 'font-sans' here to make Inter the default for everything */}
      <body className={`${inter.variable} ${abril.variable} ${aref.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}