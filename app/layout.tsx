import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";

// 모든 페이지에서 공유됨
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
