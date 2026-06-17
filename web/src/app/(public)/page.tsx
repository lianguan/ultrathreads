"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Course } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PublicCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ data: Course[] }>("/courses").then((res) => {
      setCourses(res.data || []);
    }).catch(() => setCourses([])).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold">UltraThreads</h1>
            <div className="flex gap-2">
              <Link href="/student/login">
                <Button variant="ghost">学生登录</Button>
              </Link>
              <Link href="/admin/login">
                <Button variant="ghost">管理员登录</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">探索我们的课程</h1>
          <p className="text-lg text-muted-foreground">开启你的学习之旅</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                {course.imageUrl && (
                  <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                    <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{course.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {course.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">{course.description}</p>
                  )}
                  <div className="mt-4">
                    <Badge variant="success">已发布</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {courses.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <p>暂无可用课程</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
