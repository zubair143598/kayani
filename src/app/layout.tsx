import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Kayani Towing Service | 24/7 Towing in Dammam", description: "Fast, safe and reliable towing, recovery, flatbed transport and roadside assistance in Dammam, Saudi Arabia. Call +966 50 796 3500, available 24/7.", icons: { icon: "/icon.svg" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" suppressHydrationWarning><body>{children}</body></html>; }
