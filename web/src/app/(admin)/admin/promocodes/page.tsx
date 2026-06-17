"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth";
import { AdminLayout } from "@/components/layout/admin-layout";
import { api } from "@/lib/api";
import type { PromoCode } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit } from "lucide-react";

export default function AdminPromocodesPage() {
  const router = useRouter();
  const { token, isLoading } = useAdminAuth();
  const [promocodes, setPromocodes] = useState<PromoCode[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editPromo, setEditPromo] = useState<PromoCode | null>(null);
  const [form, setForm] = useState({ code: "", discount: 0, expiresAt: "", active: true });

  useEffect(() => {
    if (!isLoading && !token) router.push("/admin/login");
  }, [token, isLoading, router]);

  useEffect(() => {
    if (token) {
      api.get<{ data: PromoCode[] }>("/admins/promocodes").then((res) => {
        setPromocodes(res.data || []);
      }).catch(() => setPromocodes([]));
    }
  }, [token]);

  const load = async () => {
    const res = await api.get<{ data: PromoCode[] }>("/admins/promocodes");
    setPromocodes(res.data || []);
  };

  const handleCreate = async () => {
    if (!form.code.trim()) return;
    await api.post("/admins/promocodes", form);
    setForm({ code: "", discount: 0, expiresAt: "", active: true });
    setDialogOpen(false);
    await load();
  };

  const handleUpdate = async () => {
    if (!editPromo) return;
    await api.put(`/admins/promocodes/${editPromo.id}`, form);
    setEditPromo(null);
    await load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除该优惠码？")) return;
    await api.delete(`/admins/promocodes/${id}`);
    await load();
  };

  const openEdit = (promo: PromoCode) => {
    setEditPromo(promo);
    setForm({ code: promo.code, discount: promo.discount, expiresAt: promo.expiresAt || "", active: promo.active });
  };

  if (isLoading) return <AdminLayout><div className="flex items-center justify-center h-64">加载中...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">优惠码管理</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />新建优惠码</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>新建优惠码</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>优惠码</Label>
                  <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>折扣 (%)</Label>
                  <Input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>过期时间</Label>
                  <Input type="datetime-local" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
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
                <TableHead>优惠码</TableHead>
                <TableHead>折扣</TableHead>
                <TableHead>过期时间</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="w-[100px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promocodes.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell className="font-mono font-medium">{promo.code}</TableCell>
                  <TableCell>{promo.discount}%</TableCell>
                  <TableCell>{promo.expiresAt ? new Date(promo.expiresAt).toLocaleDateString() : "无"}</TableCell>
                  <TableCell>
                    <Badge variant={promo.active ? "success" : "secondary"}>
                      {promo.active ? "有效" : "无效"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(promo)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(promo.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {promocodes.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">暂无优惠码</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editPromo} onOpenChange={() => setEditPromo(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>编辑优惠码</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>优惠码</Label>
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>折扣 (%)</Label>
                <Input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>过期时间</Label>
                <Input type="datetime-local" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="promoActive" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded" />
                <Label htmlFor="promoActive">有效</Label>
              </div>
              <Button onClick={handleUpdate} className="w-full">保存</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
