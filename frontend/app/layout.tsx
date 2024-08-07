import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import styles from './page.module.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ESPR: Blockchain Package Manager",
  description: "An innovative package manager on the Ethereum blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className={styles.topnav}>
          <a href='/'><h2 className={styles.topnavbrand}>ESPR ✨</h2></a>
          <a href='/browse'>Browse</a>
          <a href='/publish'>Publish</a>
          <a href='/update'>Update</a>
        </div>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
