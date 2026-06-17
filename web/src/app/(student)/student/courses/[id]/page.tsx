"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useStudentAuth } from "@/lib/student-auth";
import { StudentLayout } from "@/components/layout/student-layout";
import { api } from "@/lib/api";
import type { Course, Module, Lesson } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Play } from "lucide-react";
import Link from "next/link";

export default function StudentCourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = Number(params.id);
  const { token, isLoading } = useStudentAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    if (!isLoading && !token) router.push("/student/login");
  }, [token, isLoading, router]);

  useEffect(() => {
    if (token && courseId) {
      api.get<{ course: Course; modules: Module[] }>(`/courses/${courseId}`).then((res) => {
        setCourse(res.course);
        setModules(res.modules || []);
      }).catch(() => {});
    }
  }, [token, courseId]);

  if (isLoading) return <StudentLayout><div className="flex items-center justify-center h-64">加载中...</div></StudentLayout>;

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <Link href="/student/courses" className="text-sm text-muted-foreground hover:underline">← 返回课程列表</Link>
          <h1 className="text-3xl font-bold mt-2">{course?.name || "加载中..."}</h1>
          {course?.description && <p className="text-muted-foreground mt-2">{course.description}</p>}
        </div>

        <div className="space-y-4">
          {modules.map((module) => (
            <Card key={module.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{module.name}</CardTitle>
                  <Badge variant={module.published ? "success" : "secondary"}>
                    {module.published ? "已发布" : "未发布"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {module.lessons?.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Play className="h-4 w-4 text-muted-foreground" />
                        <span>{lesson.name}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        开始学习
                      </Button>
                    </div>
                  ))}
                  {(!module.lessons || module.lessons.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-4">暂无课时</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {modules.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>暂无模块</p>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
