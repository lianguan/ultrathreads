"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Course, Module, Offer } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PublicCourseDetailPage() {
  const params = useParams();
  const courseId = Number(params.id);
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    if (courseId) {
      api.get<{ course: Course; modules: Module[] }>(`/courses/${courseId}`).then((res) => {
        setCourse(res.course);
        setModules(res.modules || []);
      }).catch(() => {});

      api.get<{ data: Offer[] }>(`/courses/${courseId}/offers`).then((res) => {
        setOffers(res.data || []);
      }).catch(() => setOffers([]));
    }
  }, [courseId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-xl font-bold">UltraThreads</Link>
            <div className="flex gap-2">
              <Link href="/student/login">
                <Button variant="ghost">学生登录</Button>
              </Link>
              <Link href="/student/register">
                <Button>立即注册</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {course ? (
          <div className="space-y-8">
            <div>
              <Link href="/" className="text-sm text-muted-foreground hover:underline">← 返回课程列表</Link>
              <h1 className="text-4xl font-bold mt-4">{course.name}</h1>
              {course.description && <p className="text-lg text-muted-foreground mt-4">{course.description}</p>}
            </div>

            {course.imageUrl && (
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover" />
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold mb-4">课程大纲</h2>
              <div className="space-y-4">
                {modules.map((module) => (
                  <Card key={module.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{module.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {module.lessons?.map((lesson) => (
                          <div key={lesson.id} className="flex items-center gap-3 p-3 border rounded-md">
                            <div className="flex-1">{lesson.name}</div>
                          </div>
                        ))}
                        {(!module.lessons || module.lessons.length === 0) && (
                          <p className="text-sm text-muted-foreground text-center py-4">暂无课时</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {offers.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">购买选项</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {offers.map((offer) => (
                    <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle>{offer.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-3xl font-bold">
                          {offer.price.value / 100} {offer.price.currency}
                        </div>
                        {offer.description && <p className="text-sm text-muted-foreground">{offer.description}</p>}
                        {offer.benefits && offer.benefits.length > 0 && (
                          <ul className="space-y-2">
                            {offer.benefits.map((benefit, i) => (
                              <li key={i} className="text-sm flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        )}
                        <Link href="/student/register">
                          <Button className="w-full">立即购买</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>课程不存在或已下架</p>
          </div>
        )}
      </main>
    </div>
  );
}
