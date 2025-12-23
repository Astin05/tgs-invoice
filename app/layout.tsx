import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/contexts/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InvoiceFlow - Get Paid 2x Faster with Intelligent Invoice Automation",
  description: "Stop chasing payments. InvoiceFlow automates reminders, accepts payments instantly, and predicts your cash flow—so you can focus on growing your business.",
  keywords: "invoicing, payment automation, invoice software, payment reminders, cash flow management, small business accounting",
  openGraph: {
    title: "InvoiceFlow - Get Paid 2x Faster with Intelligent Invoice Automation",
    description: "Stop chasing payments. InvoiceFlow automates reminders, accepts payments instantly, and predicts your cash flow.",
    type: "website",
    url: "https://invoiceflow.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "InvoiceFlow - Get Paid 2x Faster",
    description: "Intelligent invoice automation that helps you get paid faster",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
