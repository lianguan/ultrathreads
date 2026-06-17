"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth";
import { AdminLayout } from "@/components/layout/admin-layout";
import { api } from "@/lib/api";
import type { SchoolSettings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminSettingsPage() {
  const router = useRouter();
  const { token, isLoading } = useAdminAuth();
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [schoolName, setSchoolName] = useState("");
  const [schoolSubtitle, setSchoolSubtitle] = useState("");
  const [schoolDescription, setSchoolDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isLoading && !token) router.push("/admin/login");
  }, [token, isLoading, router]);

  useEffect(() => {
    if (token) {
      api.get<any>("/settings").then((res) => {
        setSchoolName(res.name || "");
        setSchoolSubtitle(res.subtitle || "");
        setSchoolDescription(res.description || "");
        setSettings(res.settings || {});
      }).catch(() => {});
    }
  }, [token]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/admins/school/settings", {
        name: schoolName,
        color: settings?.color || "",
        contactInfo: settings?.contactInfo || {},
        pages: settings?.pages || {},
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <AdminLayout><div className="flex items-center justify-center h-64">加载中...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">学校设置</h1>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "保存中..." : saved ? "已保存!" : "保存设置"}
          </Button>
        </div>

        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">基本设置</TabsTrigger>
            <TabsTrigger value="contact">联系信息</TabsTrigger>
            <TabsTrigger value="pages">页面内容</TabsTrigger>
            <TabsTrigger value="payment">支付设置</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>基本设置</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>学校名称</Label>
                  <Input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>副标题</Label>
                  <Input value={schoolSubtitle} onChange={(e) => setSchoolSubtitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>描述</Label>
                  <Textarea value={schoolDescription} onChange={(e) => setSchoolDescription(e.target.value)} rows={4} />
                </div>
                <div className="space-y-2">
                  <Label>主题颜色</Label>
                  <Input value={settings?.color || ""} onChange={(e) => setSettings({ ...settings!, color: e.target.value })} placeholder="#000000" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="disableReg" checked={settings?.disableRegistration || false} onCheckedChange={(v) => setSettings({ ...settings!, disableRegistration: v })} />
                  <Label htmlFor="disableReg">禁用注册</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="showPayImg" checked={settings?.showPaymentImages || false} onCheckedChange={(v) => setSettings({ ...settings!, showPaymentImages: v })} />
                  <Label htmlFor="showPayImg">显示支付图片</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>联系信息</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>企业名称</Label>
                  <Input value={settings?.contactInfo?.businessName || ""} onChange={(e) => setSettings({ ...settings!, contactInfo: { ...settings!.contactInfo, businessName: e.target.value } })} />
                </div>
                <div className="space-y-2">
                  <Label>注册号</Label>
                  <Input value={settings?.contactInfo?.registrationNumber || ""} onChange={(e) => setSettings({ ...settings!, contactInfo: { ...settings!.contactInfo, registrationNumber: e.target.value } })} />
                </div>
                <div className="space-y-2">
                  <Label>地址</Label>
                  <Input value={settings?.contactInfo?.address || ""} onChange={(e) => setSettings({ ...settings!, contactInfo: { ...settings!.contactInfo, address: e.target.value } })} />
                </div>
                <div className="space-y-2">
                  <Label>联系邮箱</Label>
                  <Input type="email" value={settings?.contactInfo?.email || ""} onChange={(e) => setSettings({ ...settings!, contactInfo: { ...settings!.contactInfo, email: e.target.value } })} />
                </div>
                <div className="space-y-2">
                  <Label>联系电话</Label>
                  <Input value={settings?.contactInfo?.phone || ""} onChange={(e) => setSettings({ ...settings!, contactInfo: { ...settings!.contactInfo, phone: e.target.value } })} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>页面内容</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>隐私政策</Label>
                  <Textarea value={settings?.pages?.confidential || ""} onChange={(e) => setSettings({ ...settings!, pages: { ...settings!.pages, confidential: e.target.value } })} rows={6} />
                </div>
                <div className="space-y-2">
                  <Label>服务协议</Label>
                  <Textarea value={settings?.pages?.serviceAgreement || ""} onChange={(e) => setSettings({ ...settings!, pages: { ...settings!.pages, serviceAgreement: e.target.value } })} rows={6} />
                </div>
                <div className="space-y-2">
                  <Label>邮件订阅同意条款</Label>
                  <Textarea value={settings?.pages?.newsletterConsent || ""} onChange={(e) => setSettings({ ...settings!, pages: { ...settings!.pages, newsletterConsent: e.target.value } })} rows={6} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Fondy 支付配置</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>商户 ID</Label>
                  <Input value={settings?.fondy?.merchantId || ""} onChange={(e) => setSettings({ ...settings!, fondy: { ...settings!.fondy, merchantId: e.target.value, merchantPassword: settings?.fondy?.merchantPassword || "", connected: settings?.fondy?.connected || false } })} />
                </div>
                <div className="space-y-2">
                  <Label>商户密码</Label>
                  <Input type="password" value={settings?.fondy?.merchantPassword || ""} onChange={(e) => setSettings({ ...settings!, fondy: { ...settings!.fondy, merchantPassword: e.target.value, merchantId: settings?.fondy?.merchantId || "", connected: settings?.fondy?.connected || false } })} />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="fondyConnected" checked={settings?.fondy?.connected || false} onCheckedChange={(v) => setSettings({ ...settings!, fondy: { ...settings!.fondy, connected: v } })} />
                  <Label htmlFor="fondyConnected">已连接</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
