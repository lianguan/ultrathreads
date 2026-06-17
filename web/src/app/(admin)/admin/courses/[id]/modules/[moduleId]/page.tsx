"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth";
import { AdminLayout } from "@/components/layout/admin-layout";
import { api } from "@/lib/api";
import type { Lesson } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Edit, Trash2, FileText } from "lucide-react";
import Link from "next/link";

export default function AdminModuleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = Number(params.id);
  const moduleId = Number(params.moduleId);
  const { token, isLoading } = useAdminAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newLessonName, setNewLessonName] = useState("");
  const [editLesson, setEditLesson] = useState<Lesson | null>(null);
  const [editName, setEditName] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editPublished, setEditPublished] = useState(false);

  useEffect(() => {
    if (!isLoading && !token) router.push("/admin/login");
  }, [token, isLoading, router]);

  useEffect(() => {
    if (token && moduleId) {
      api.get<{ data: Lesson[] }>(`/admins/modules/${moduleId}/lessons`).then((res) => {
        setLessons(res.data || []);
      }).catch(() => setLessons([]));
    }
  }, [token, moduleId]);

  const loadLessons = async () => {
    const res = await api.get<{ data: Lesson[] }>(`/admins/modules/${moduleId}/lessons`);
    setLessons(res.data || []);
  };

  const handleCreateLesson = async () => {
    if (!newLessonName.trim()) return;
    await api.post(`/admins/modules/${moduleId}/lessons`, { name: newLessonName, position: lessons.length + 1 });
    setNewLessonName("");
    setDialogOpen(false);
    await loadLessons();
  };

  const handleUpdateLesson = async () => {
    if (!editLesson) return;
    await api.put(`/admins/lessons/${editLesson.id}`, {
      name: editName,
      content: editContent,
      published: editPublished,
    });
    setEditLesson(null);
    setEditDialogOpen(false);
    await loadLessons();
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (!confirm("确定删除该课时？")) return;
    await api.delete(`/admins/lessons/${lessonId}`);
    await loadLessons();
  };

  const openEditDialog = async (lesson: Lesson) => {
    setEditLesson(lesson);
    setEditName(lesson.name);
    setEditPublished(lesson.published);
    // Fetch lesson content
    const detail = await api.get<Lesson>(`/admins/lessons/${lesson.id}`);
    setEditContent((detail as any).content || "");
    setEditDialogOpen(true);
  };

  if (isLoading) return <AdminLayout><div className="flex items-center justify-center h-64">加载中...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <Link href={`/admin/courses/${courseId}`} className="text-sm text-muted-foreground hover:underline">← 返回课程</Link>
          <h1 className="text-3xl font-bold mt-2">课时管理</h1>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">课时列表</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />新建课时</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>新建课时</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>课时名称</Label>
                  <Input value={newLessonName} onChange={(e) => setNewLessonName(e.target.value)} placeholder="输入课时名称" />
                </div>
                <Button onClick={handleCreateLesson} className="w-full">创建</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {lessons.map((lesson) => (
            <Card key={lesson.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{lesson.name}</CardTitle>
                  <Badge variant={lesson.published ? "success" : "secondary"}>
                    {lesson.published ? "已发布" : "未发布"}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(lesson)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteLesson(lesson.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">位置: {lesson.position}</p>
              </CardContent>
            </Card>
          ))}
          {lessons.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">暂无课时</div>
          )}
        </div>

        {/* Edit Lesson Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>编辑课时</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>课时名称</Label>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>课时内容 (HTML)</Label>
                <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={10} />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="lessonPublished" checked={editPublished} onChange={(e) => setEditPublished(e.target.checked)} className="rounded" />
                <Label htmlFor="lessonPublished">已发布</Label>
              </div>
              <Button onClick={handleUpdateLesson} className="w-full">保存</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
