"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth";
import { AdminLayout } from "@/components/layout/admin-layout";
import { api } from "@/lib/api";
import type { Student } from "@/lib/types";
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
import { Plus, Trash2, Ban, CheckCircle } from "lucide-react";

export default function AdminStudentsPage() {
  const router = useRouter();
  const { token, isLoading } = useAdminAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (!isLoading && !token) router.push("/admin/login");
  }, [token, isLoading, router]);

  useEffect(() => {
    if (token) {
      api.get<{ data: Student[] }>("/admins/students").then((res) => {
        setStudents(res.data || []);
      }).catch(() => setStudents([]));
    }
  }, [token]);

  const loadStudents = async () => {
    const res = await api.get<{ data: Student[] }>("/admins/students");
    setStudents(res.data || []);
  };

  const handleCreate = async () => {
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) return;
    await api.post("/admins/students", { name: newName, email: newEmail, password: newPassword });
    setNewName(""); setNewEmail(""); setNewPassword("");
    setDialogOpen(false);
    await loadStudents();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除该学生？")) return;
    await api.delete(`/admins/students/${id}`);
    await loadStudents();
  };

  const handleToggleBlock = async (student: Student) => {
    await api.put(`/admins/students/${student.id}`, { blocked: !student.blocked });
    await loadStudents();
  };

  if (isLoading) return <AdminLayout><div className="flex items-center justify-center h-64">加载中...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">学生管理</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />新建学生</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>新建学生</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>姓名</Label>
                  <Input value={newName} onChange={(e) => setNewName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>邮箱</Label>
                  <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>密码</Label>
                  <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
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
                <TableHead>姓名</TableHead>
                <TableHead>邮箱</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="w-[100px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <Badge variant={student.blocked ? "destructive" : "success"}>
                      {student.blocked ? "已封禁" : "正常"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleToggleBlock(student)} title={student.blocked ? "解封" : "封禁"}>
                        {student.blocked ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Ban className="h-4 w-4 text-red-500" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(student.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {students.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">暂无学生</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
