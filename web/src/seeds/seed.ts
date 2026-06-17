/**
 * 种子数据脚本
 * 用于初始化测试数据到后端数据库
 */

import { api } from '@/lib/api';

async function seed() {
  console.log('🌱 开始初始化种子数据...\n');

  try {
    // 1. 创建管理员
    console.log('📝 创建管理员...');
    await api.post('/admins', {
      name: '测试管理员',
      email: 'admin@test.com',
      password: 'admin123456',
    });
    console.log('✅ 管理员创建成功: admin@test.com / admin123456\n');

    // 2. 创建学生
    console.log('👨‍🎓 创建学生...');
    await api.post('/students', {
      name: '测试学生',
      email: 'student@test.com',
      password: 'student123',
    });
    await api.post('/students', {
      name: '王五',
      email: 'student2@test.com',
      password: 'student123',
    });
    await api.post('/students', {
      name: '赵六',
      email: 'student3@test.com',
      password: 'student123',
    });
    console.log('✅ 学生创建成功\n');

    // 3. 创建课程
    console.log('📚 创建课程...');
    const courseRes = await api.post<{ id: number }>('/courses', {
      name: 'Go 语言全栈开发',
      description: '从零开始学习 Go 语言，掌握后端开发技能。本课程涵盖 Go 语言基础、Web 开发、数据库操作、并发编程等核心内容。',
      imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
      color: '#00ADD8',
      published: true,
    });
    const courseId = courseRes.id;
    console.log(`✅ 课程创建成功 (ID: ${courseId})\n`);

    // 4. 创建模块
    console.log('📦 创建模块...');
    const module1Res = await api.post<{ id: number }>(`/courses/${courseId}/modules`, {
      name: 'Go 语言基础',
      position: 1,
      published: true,
    });
    const module1Id = module1Res.id;

    const module2Res = await api.post<{ id: number }>(`/courses/${courseId}/modules`, {
      name: 'Web 开发实战',
      position: 2,
      published: true,
    });
    const module2Id = module2Res.id;
    console.log(`✅ 模块创建成功 (ID: ${module1Id}, ${module2Id})\n`);

    // 5. 创建课时
    console.log('📖 创建课时...');
    await api.post(`/modules/${module1Id}/lessons`, {
      name: 'Go 语言简介',
      position: 1,
      published: true,
    });
    await api.post(`/modules/${module1Id}/lessons`, {
      name: '变量与数据类型',
      position: 2,
      published: true,
    });
    await api.post(`/modules/${module1Id}/lessons`, {
      name: '控制流程',
      position: 3,
      published: true,
    });
    await api.post(`/modules/${module2Id}/lessons`, {
      name: 'HTTP 服务器',
      position: 1,
      published: true,
    });
    await api.post(`/modules/${module2Id}/lessons`, {
      name: '路由处理',
      position: 2,
      published: true,
    });
    await api.post(`/modules/${module2Id}/lessons`, {
      name: '中间件',
      position: 3,
      published: true,
    });
    console.log('✅ 课时创建成功\n');

    // 6. 创建套餐
    console.log('💎 创建套餐...');
    await api.post(`/courses/${courseId}/packages`, {
      name: '基础套餐',
      description: '包含所有的基础课程',
      benefits: ['访问所有基础课程', '社区支持', '结业证书'],
      price: { value: 29900, currency: 'CNY' },
      modules: [module1Id],
    });
    await api.post(`/courses/${courseId}/packages`, {
      name: '高级套餐',
      description: '包含所有课程和实战项目',
      benefits: ['访问所有课程', '1对1辅导', '实战项目', '就业推荐'],
      price: { value: 59900, currency: 'CNY' },
      modules: [module1Id, module2Id],
    });
    console.log('✅ 套餐创建成功\n');

    // 7. 创建优惠码
    console.log('🎫 创建优惠码...');
    await api.post('/promocodes', {
      code: 'WELCOME20',
      discount: 20,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      active: true,
    });
    await api.post('/promocodes', {
      code: 'NEWYEAR50',
      discount: 50,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      active: true,
    });
    console.log('✅ 优惠码创建成功\n');

    console.log('🎉 种子数据初始化完成！\n');
    console.log('测试账号:');
    console.log('  管理员: admin@test.com / admin123456');
    console.log('  学生: student@test.com / student123\n');
  } catch (error) {
    console.error('❌ 种子数据初始化失败:', error);
    process.exit(1);
  }
}

// 运行种子脚本
seed();
