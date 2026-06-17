"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStudentAuth } from "@/lib/student-auth";
import { StudentLayout } from "@/components/layout/student-layout";
import { api } from "@/lib/api";
import type { Course } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export default function StudentCoursesPage() {
  const router = useRouter();
  const { token, isLoading } = useStudentAuth();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!isLoading && !token) router.push("/student/login");
  }, [token, isLoading, router]);

  useEffect(() => {
    if (token) {
      api.get<{ data: Course[] }>("/courses").then((res) => {
        setCourses(res.data || []);
      }).catch(() => setCourses([]));
    }
  }, [token]);

  if (isLoading) return <StudentLayout><div className="flex items-center justify-center h-64">加载中...</div></StudentLayout>;

  return (
    <StudentLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">我的课程</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link key={course.id} href={`/student/courses/${course.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  )}
                  <div className="mt-4">
                    <Badge variant={course.published ? "success" : "secondary"}>
                      {course.published ? "已发布" : "未发布"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {courses.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无可用课程</p>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
