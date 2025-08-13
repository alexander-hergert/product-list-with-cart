import "./globals.css";
import { Inter } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import Providers from "./providers";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";

export const metadata = {
  metadataBase: new URL("https://postgres-prisma.vercel.app"),
  title: "Daily Cravings",
  description:
    "A simple Next.js app with Vercel Postgres as the database and Prisma as the ORM",
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

//moved to layout for now
const SignUpHandler = dynamic(() => import("@/components/SignUpHandler"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.variable}>
        <ClerkProvider>
          <AppRouterCacheProvider options={{ key: "css" }}>
            <ThemeProvider theme={theme}>
              <Providers>
                <SignedOut>
                  <div className="flex justify-between items-center w-[220px] ml-2 mt-2">
                    <div className="block text-center font-medium text-white bg-blue-500 w-[100px] rounded-lg p-1">
                      <SignInButton />
                    </div>
                    <Link
                      className="block text-center font-medium text-white bg-blue-500 w-[100px] rounded-lg p-1"
                      href="/signup"
                    >
                      To Sign up
                    </Link>
                  </div>
                </SignedOut>
                <SignedIn>
                  <div className="flex gap-4 items-center">
                    <SignUpHandler />
                    <Navbar />
                    <MobileNavbar />
                  </div>
                </SignedIn>
                {children}
              </Providers>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
