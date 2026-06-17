"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth";
import { AdminLayout } from "@/components/layout/admin-layout";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Tag, ShoppingCart } from "lucide-react";

interface DashboardStats {
  courses: number;
  students: number;
  promocodes: number;
  orders: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { token, isLoading } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats>({
    courses: 0,
    students: 0,
    promocodes: 0,
    orders: 0,
  });

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/admin/login");
    }
  }, [token, isLoading, router]);

  useEffect(() => {
    if (token) {
      // Fetch dashboard stats
      Promise.all([
        api.get<{ data: any[] }>("/admins/courses"),
        api.get<{ data: any[] }>("/admins/students"),
        api.get<{ data: any[] }>("/admins/promocodes"),
        api.get<{ data: any[] }>("/admins/orders"),
      ])
        .then(([courses, students, promocodes, orders]) => {
          setStats({
            courses: courses.data?.length || 0,
            students: students.data?.length || 0,
            promocodes: promocodes.data?.length || 0,
            orders: orders.data?.length || 0,
          });
        })
        .catch(console.error);
    }
  }, [token]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">加载中...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">仪表板</h1>
          <p className="text-gray-500 mt-1">欢迎使用 UltraThreads 管理后台</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">课程数量</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.courses}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">学生数量</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.students}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">优惠码数量</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.promocodes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">订单数量</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.orders}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
