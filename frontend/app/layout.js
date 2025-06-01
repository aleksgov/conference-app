import { ThemeProvider, ThemeModeScript } from 'flowbite-react';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Conferva",
    description: "",
    icons: {
        icon: "/favicon.ico",
        }
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.ico" />
                <ThemeModeScript />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 dark:bg-gray-900`}
            >
                <ThemeProvider>
                    <Navbar />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
