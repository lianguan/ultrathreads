"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth";
import { AdminLayout } from "@/components/layout/admin-layout";
import { api } from "@/lib/api";
import type { Course, Module } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, BookOpen, ClipboardList } from "lucide-react";
import Link from "next/link";

export default function AdminCourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = Number(params.id);
  const { token, isLoading } = useAdminAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [newModuleName, setNewModuleName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !token) router.push("/admin/login");
  }, [token, isLoading, router]);

  useEffect(() => {
    if (token && courseId) {
      api.get<{ course: Course; modules: Module[] }>(`/admins/courses/${courseId}`).then((res) => {
        setCourse(res.course);
        setModules(res.modules || []);
      });
    }
  }, [token, courseId]);

  const handleCreateModule = async () => {
    if (!newModuleName.trim()) return;
    const res = await api.post<{ id: number }>(`/admins/courses/${courseId}/modules`, { name: newModuleName, position: modules.length + 1 });
    setNewModuleName("");
    setDialogOpen(false);
    const data = await api.get<{ course: Course; modules: Module[] }>(`/admins/courses/${courseId}`);
    setCourse(data.course);
    setModules(data.modules || []);
  };

  const handleDeleteModule = async (moduleId: number) => {
    if (!confirm("确定删除该模块？")) return;
    await api.delete(`/admins/modules/${moduleId}`);
    const data = await api.get<{ course: Course; modules: Module[] }>(`/admins/courses/${courseId}`);
    setCourse(data.course);
    setModules(data.modules || []);
  };

  if (isLoading) return <AdminLayout><div className="flex items-center justify-center h-64">加载中...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/admin/courses" className="text-sm text-muted-foreground hover:underline">← 返回课程列表</Link>
            <h1 className="text-3xl font-bold mt-2">{course?.name || "加载中..."}</h1>
            {course?.description && <p className="text-muted-foreground mt-1">{course.description}</p>}
          </div>
          <div className="flex gap-2">
            <Badge variant={course?.published ? "success" : "secondary"}>
              {course?.published ? "已发布" : "未发布"}
            </Badge>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">模块列表</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />新建模块</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>新建模块</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>模块名称</Label>
                  <Input value={newModuleName} onChange={(e) => setNewModuleName(e.target.value)} placeholder="输入模块名称" />
                </div>
                <Button onClick={handleCreateModule} className="w-full">创建</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {modules.map((module) => (
            <Card key={module.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{module.name}</CardTitle>
                  <Badge variant={module.published ? "success" : "secondary"}>
                    {module.published ? "已发布" : "未发布"}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Link href={`/admin/courses/${courseId}/modules/${module.id}`}>
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                  </Link>
                  <Link href={`/admin/surveys/${module.id}`}>
                    <Button variant="ghost" size="icon" title="问卷管理"><ClipboardList className="h-4 w-4" /></Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteModule(module.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">位置: {module.position}</p>
              </CardContent>
            </Card>
          ))}
          {modules.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">暂无模块</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
