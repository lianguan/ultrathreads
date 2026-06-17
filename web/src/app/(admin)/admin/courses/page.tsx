"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth";
import { AdminLayout } from "@/components/layout/admin-layout";
import { api } from "@/lib/api";
import type { Course } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export default function AdminCoursesPage() {
  const router = useRouter();
  const { token, isLoading } = useAdminAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPublished, setEditPublished] = useState(false);

  useEffect(() => {
    if (!isLoading && !token) router.push("/admin/login");
  }, [token, isLoading, router]);

  useEffect(() => {
    if (token) {
      api.get<{ data: Course[] }>("/admins/courses").then((res) => {
        setCourses(res.data || []);
      });
    }
  }, [token]);

  const handleCreate = async () => {
    if (!newCourseName.trim()) return;
    await api.post("/admins/courses", { name: newCourseName });
    setNewCourseName("");
    setDialogOpen(false);
    const res = await api.get<{ data: Course[] }>("/admins/courses");
    setCourses(res.data || []);
  };

  const handleUpdate = async () => {
    if (!editCourse) return;
    await api.put(`/admins/courses/${editCourse.id}`, {
      name: editName,
      description: editDescription,
      published: editPublished,
    });
    setEditCourse(null);
    const res = await api.get<{ data: Course[] }>("/admins/courses");
    setCourses(res.data || []);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除该课程？")) return;
    await api.delete(`/admins/courses/${id}`);
    const res = await api.get<{ data: Course[] }>("/admins/courses");
    setCourses(res.data || []);
  };

  if (isLoading) return <AdminLayout><div className="flex items-center justify-center h-64">加载中...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">课程管理</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />新建课程</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>新建课程</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>课程名称</Label>
                  <Input value={newCourseName} onChange={(e) => setNewCourseName(e.target.value)} placeholder="输入课程名称" />
                </div>
                <Button onClick={handleCreate} className="w-full">创建</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>描述</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="w-[100px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">
                    <Link href={`/admin/courses/${course.id}`} className="text-primary hover:underline">
                      {course.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">{course.description || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={course.published ? "success" : "secondary"}>
                      {course.published ? "已发布" : "未发布"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditCourse(course); setEditName(course.name); setEditDescription(course.description || ""); setEditPublished(course.published); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(course.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {courses.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">暂无课程</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editCourse} onOpenChange={() => setEditCourse(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>编辑课程</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>课程名称</Label>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>描述</Label>
                <Input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="published" checked={editPublished} onChange={(e) => setEditPublished(e.target.checked)} className="rounded" />
                <Label htmlFor="published">已发布</Label>
              </div>
              <Button onClick={handleUpdate} className="w-full">保存</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
