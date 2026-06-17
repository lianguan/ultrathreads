"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStudentAuth } from "@/lib/student-auth";
import { StudentLayout } from "@/components/layout/student-layout";
import { api } from "@/lib/api";
import type { Student } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function StudentProfilePage() {
  const router = useRouter();
  const { token, isLoading, student } = useStudentAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!isLoading && !token) router.push("/student/login");
  }, [token, isLoading, router]);

  useEffect(() => {
    if (student) {
      setName(student.name);
      setEmail(student.email);
    }
  }, [student]);

  if (isLoading) return <StudentLayout><div className="flex items-center justify-center h-64">加载中...</div></StudentLayout>;

  return (
    <StudentLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">个人信息</h1>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>姓名</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>邮箱</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button>保存修改</Button>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
}
