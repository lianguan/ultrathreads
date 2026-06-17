import type { Metadata } from "next";
import "./globals.css";
import { AdminAuthProvider } from "@/lib/admin-auth";
import { StudentAuthProvider } from "@/lib/student-auth";

export const metadata: Metadata = {
  title: "UltraThreads - 在线学习平台",
  description: "UltraThreads 在线学习管理系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans">
        <AdminAuthProvider>
          <StudentAuthProvider>
            {children}
          </StudentAuthProvider>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
