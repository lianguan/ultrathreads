/**
 * 前端模拟数据
 * 用于本地开发和测试
 */

import type {
  School,
  Admin,
  Student,
  Course,
  Module,
  Lesson,
  Package,
  Offer,
  PromoCode,
  Order,
  Survey,
} from '@/lib/types';

// 学校数据
export const mockSchool: School = {
  id: 1,
  name: 'UltraThreads 学院',
  subtitle: '专业的在线教育平台',
  description: '提供高质量的编程课程和技能培训',
  registeredAt: '2024-01-01T00:00:00Z',
  settings: {
    color: '#3B82F6',
    domains: ['localhost:3000'],
    contactInfo: {
      businessName: 'UltraThreads 教育科技有限公司',
      registrationNumber: '91110108MA01XXXX',
      address: '北京市海淀区中关村大街1号',
      email: 'contact@ultrathreads.com',
      phone: '+86 10 12345678',
    },
    pages: {
      confidential: '隐私政策内容...',
      serviceAgreement: '服务协议内容...',
      newsletterConsent: '邮件订阅同意条款...',
    },
    showPaymentImages: true,
    logo: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=200',
    googleAnalyticsCode: 'GA-XXXXX',
    fondy: {
      merchantId: 'test_merchant',
      merchantPassword: 'test_password',
      connected: true,
    },
    sendpulse: {
      id: 'test_id',
      secret: 'test_secret',
      listId: 'test_list',
      connected: true,
    },
    disableRegistration: false,
  },
};

// 管理员数据
export const mockAdmins: Admin[] = [
  {
    id: 1,
    name: '张三',
    email: 'admin@test.com',
    schoolId: 1,
  },
  {
    id: 2,
    name: '李四',
    email: 'admin2@test.com',
    schoolId: 1,
  },
];

// 学生数据
export const mockStudents: Student[] = [
  {
    id: 1,
    name: '王五',
    email: 'student@test.com',
    schoolId: 1,
    blocked: false,
    offers: [1, 2],
  },
  {
    id: 2,
    name: '赵六',
    email: 'student2@test.com',
    schoolId: 1,
    blocked: false,
    offers: [1],
  },
  {
    id: 3,
    name: '钱七',
    email: 'student3@test.com',
    schoolId: 1,
    blocked: true,
    offers: [],
  },
];

// 课程数据
export const mockCourses: Course[] = [
  {
    id: 1,
    name: 'Go 语言全栈开发',
    description: '从零开始学习 Go 语言，掌握后端开发技能。本课程涵盖 Go 语言基础、Web 开发、数据库操作、并发编程等核心内容。',
    imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    color: '#00ADD8',
    published: true,
  },
  {
    id: 2,
    name: 'React 前端开发',
    description: '学习现代前端开发，掌握 React、TypeScript、Next.js 等技术栈。',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    color: '#61DAFB',
    published: true,
  },
  {
    id: 3,
    name: 'Python 数据科学',
    description: '使用 Python 进行数据分析和机器学习，掌握 Pandas、NumPy、Scikit-learn 等工具。',
    imageUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800',
    color: '#3776AB',
    published: false,
  },
];

// 模块数据
export const mockModules: Module[] = [
  {
    id: 1,
    name: 'Go 语言基础',
    position: 1,
    published: true,
  },
  {
    id: 2,
    name: 'Web 开发实战',
    position: 2,
    published: true,
  },
  {
    id: 3,
    name: 'React 基础',
    position: 1,
    published: true,
  },
  {
    id: 4,
    name: 'React 进阶',
    position: 2,
    published: true,
  },
];

// 课时数据
export const mockLessons: Lesson[] = [
  {
    id: 1,
    name: 'Go 语言简介',
    position: 1,
    published: true,
  },
  {
    id: 2,
    name: '变量与数据类型',
    position: 2,
    published: true,
  },
  {
    id: 3,
    name: '控制流程',
    position: 3,
    published: true,
  },
  {
    id: 4,
    name: 'HTTP 服务器',
    position: 1,
    published: true,
  },
  {
    id: 5,
    name: '路由处理',
    position: 2,
    published: true,
  },
  {
    id: 6,
    name: '中间件',
    position: 3,
    published: true,
  },
  {
    id: 7,
    name: 'React 组件',
    position: 1,
    published: true,
  },
  {
    id: 8,
    name: 'Hooks 详解',
    position: 2,
    published: true,
  },
  {
    id: 9,
    name: '状态管理',
    position: 3,
    published: true,
  },
  {
    id: 10,
    name: 'Next.js 入门',
    position: 1,
    published: true,
  },
  {
    id: 11,
    name: 'SSR 与 SSG',
    position: 2,
    published: true,
  },
  {
    id: 12,
    name: 'API 路由',
    position: 3,
    published: true,
  },
];

// 套餐数据
export const mockPackages: Package[] = [
  {
    id: 1,
    name: '基础套餐',
    description: '包含所有基础课程',
    benefits: ['访问所有基础课程', '社区支持', '结业证书'],
    price: { value: 29900, currency: 'CNY' },
    modules: [1, 2],
  },
  {
    id: 2,
    name: '高级套餐',
    description: '包含所有课程和实战项目',
    benefits: ['访问所有课程', '1对1辅导', '实战项目', '就业推荐'],
    price: { value: 59900, currency: 'CNY' },
    modules: [1, 2, 3, 4],
  },
  {
    id: 3,
    name: '企业套餐',
    description: '为企业定制的培训方案',
    benefits: ['所有高级套餐权益', '企业内训', '定制课程', '专属客服'],
    price: { value: 99900, currency: 'CNY' },
    modules: [1, 2, 3, 4],
  },
];

// 优惠数据
export const mockOffers: Offer[] = [
  {
    id: 1,
    name: 'Go 语言课程',
    description: '学习 Go 语言全栈开发',
    price: { value: 29900, currency: 'CNY' },
    benefits: ['完整课程内容', '源码访问', '社区支持'],
    paymentMethod: { usesProvider: true },
    moduleId: 1,
  },
  {
    id: 2,
    name: 'React 课程',
    description: '掌握现代前端开发',
    price: { value: 39900, currency: 'CNY' },
    benefits: ['完整课程内容', '项目实战', '就业指导'],
    paymentMethod: { usesProvider: true },
    moduleId: 3,
  },
];

// 优惠码数据
export const mockPromoCodes: PromoCode[] = [
  {
    id: 1,
    code: 'WELCOME20',
    discount: 20,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    active: true,
    offerIds: [1, 2],
  },
  {
    id: 2,
    code: 'NEWYEAR50',
    discount: 50,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    active: true,
    offerIds: [1, 2],
  },
  {
    id: 3,
    code: 'SUMMER30',
    discount: 30,
    expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 已过期
    active: false,
    offerIds: [1],
  },
];

// 订单数据
export const mockOrders: Order[] = [
  {
    id: 1,
    studentId: 1,
    offerId: 1,
    status: 'paid',
    amount: 23920,
    currency: 'CNY',
    createdAt: '2024-01-15T10:00:00Z',
    promo: { code: 'WELCOME20', discount: 20 },
  },
  {
    id: 2,
    studentId: 1,
    offerId: 2,
    status: 'created',
    amount: 39900,
    currency: 'CNY',
    createdAt: '2024-01-20T14:30:00Z',
  },
  {
    id: 3,
    studentId: 2,
    offerId: 1,
    status: 'paid',
    amount: 29900,
    currency: 'CNY',
    createdAt: '2024-01-18T09:15:00Z',
  },
  {
    id: 4,
    studentId: 3,
    offerId: 2,
    status: 'failed',
    amount: 39900,
    currency: 'CNY',
    createdAt: '2024-01-19T16:45:00Z',
  },
];

// 问卷数据
export const mockSurveys: Survey[] = [
  {
    id: 1,
    moduleId: 1,
    questions: [
      { id: 1, text: '你对本课程的内容满意吗？', required: true },
      { id: 2, text: '你在学习过程中遇到了哪些困难？', required: false },
      { id: 3, text: '你推荐本课程给朋友吗？', required: true },
    ],
  },
  {
    id: 2,
    moduleId: 3,
    questions: [
      { id: 4, text: '课程难度是否合适？', required: true },
      { id: 5, text: '你对讲师的教学方式满意吗？', required: true },
    ],
  },
];

// 导出所有模拟数据
export const mockData = {
  school: mockSchool,
  admins: mockAdmins,
  students: mockStudents,
  courses: mockCourses,
  modules: mockModules,
  lessons: mockLessons,
  packages: mockPackages,
  offers: mockOffers,
  promoCodes: mockPromoCodes,
  orders: mockOrders,
  surveys: mockSurveys,
};

// 测试账号信息
export const testAccounts = {
  admin: {
    email: 'admin@test.com',
    password: 'admin123456',
  },
  student: {
    email: 'student@test.com',
    password: 'student123',
  },
};
