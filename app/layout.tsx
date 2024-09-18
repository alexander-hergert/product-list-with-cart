import "./globals.css";
import { Inter } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Providers from "./providers";
import Link from "next/link";
import dynamic from "next/dynamic";

export const metadata = {
  metadataBase: new URL("https://postgres-prisma.vercel.app"),
  title: "Product-List-With-Cart",
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
    <html lang="en">
      <body className={inter.variable}>
        <ClerkProvider>
          <Providers>
            <SignedOut>
              <div className="flex justify-between items-center w-[140px] ml-2">
                <SignInButton />
                <Link href="/signup">To SignUp</Link>
              </div>
            </SignedOut>
            <SignedIn>
              <SignUpHandler />
              <UserButton />
            </SignedIn>
            {children}
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
