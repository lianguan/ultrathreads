"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStudentAuth } from "@/lib/student-auth";
import { StudentLayout } from "@/components/layout/student-layout";
import { api } from "@/lib/api";
import type { Order } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export default function StudentOrdersPage() {
  const router = useRouter();
  const { token, isLoading } = useStudentAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isLoading && !token) router.push("/student/login");
  }, [token, isLoading, router]);

  useEffect(() => {
    if (token) {
      // Note: Students don't have a direct orders list endpoint in the API
      // This would need to be implemented in the backend
      setOrders([]);
    }
  }, [token]);

  const statusVariant = (status: string) => {
    switch (status) {
      case "paid": return "success" as const;
      case "created": return "warning" as const;
      case "failed": return "destructive" as const;
      default: return "secondary" as const;
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "paid": return "已支付";
      case "created": return "待支付";
      case "failed": return "失败";
      default: return status;
    }
  };

  if (isLoading) return <StudentLayout><div className="flex items-center justify-center h-64">加载中...</div></StudentLayout>;

  return (
    <StudentLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">我的订单</h1>

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>订单ID</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>创建时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono">#{order.id}</TableCell>
                  <TableCell>{order.amount / 100} {order.currency}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(order.status)}>
                      {statusLabel(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">暂无订单</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </StudentLayout>
  );
}
