-- ============================================================
-- UltraThreads LMS - 数据库初始化与模拟数据
-- 密码统一为: admin (SHA1, 空盐值)
-- 哈希值: d033e22ae348aeb5660fc2140aec35850c4da997
-- ============================================================

-- 清空所有表（按外键依赖顺序）
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `survey_results`;
TRUNCATE TABLE `student_lessons`;
TRUNCATE TABLE `orders`;
TRUNCATE TABLE `promo_codes`;
TRUNCATE TABLE `files`;
TRUNCATE TABLE `offers`;
TRUNCATE TABLE `packages`;
TRUNCATE TABLE `lesson_contents`;
TRUNCATE TABLE `lessons`;
TRUNCATE TABLE `modules`;
TRUNCATE TABLE `courses`;
TRUNCATE TABLE `students`;
TRUNCATE TABLE `admins`;
TRUNCATE TABLE `users`;
TRUNCATE TABLE `schools`;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 1. 学校 (Schools)
-- ============================================================
INSERT INTO `schools` (`id`, `name`, `subtitle`, `description`, `registered_at`, `settings`) VALUES
(1, 'UltraThreads Academy', '学习改变未来', 'UltraThreads 官方示范学校，提供编程、设计等在线课程', '2025-01-01 00:00:00', '{"color":"#4F46E5","domains":["academy.ultrathreads.me"],"contactInfo":{"businessName":"UltraThreads Inc.","registrationNumber":"UT-2025-001","address":"北京市海淀区中关村大街1号","email":"contact@ultrathreads.me","phone":"+86-10-88888888"},"pages":{"confidential":"我们重视您的隐私。所有个人信息将被严格保密。","serviceAgreement":"使用本平台即表示您同意我们的服务条款。","newsletterConsent":"我同意接收来自UltraThreads的邮件通知。"},"showPaymentImages":true,"logo":"https://storage.ultrathreads.me/logo.png","googleAnalyticsCode":"UA-12345678-1","fondy":{"merchantId":"","merchantPassword":"","connected":false},"sendpulse":{"id":"","secret":"","listId":"","connected":false},"disableRegistration":false}'),
(2, 'Creative Design School', '创意无界', '专注于设计与创意领域的在线教育平台', '2025-03-15 00:00:00', '{"color":"#EC4899","domains":["design.ultrathreads.me"],"contactInfo":{"businessName":"Creative Design Ltd.","registrationNumber":"CD-2025-002","address":"上海市浦东新区世纪大道100号","email":"hello@designschool.me","phone":"+86-21-66666666"},"pages":{"confidential":"","serviceAgreement":"","newsletterConsent":""},"showPaymentImages":false,"logo":"","googleAnalyticsCode":"","fondy":{"merchantId":"","merchantPassword":"","connected":false},"sendpulse":{"id":"","secret":"","listId":"","connected":false},"disableRegistration":false}');

-- ============================================================
-- 2. 管理员 (Admins) - 密码: admin
-- ============================================================
INSERT INTO `admins` (`id`, `name`, `email`, `password`, `school_id`, `session_refresh_token`, `session_expires_at`) VALUES
(1, 'admin', 'admin@admin.com', 'd033e22ae348aeb5660fc2140aec35850c4da997', 1, '', NULL),
(2, '张老师', 'zhang@ultrathreads.me', 'd033e22ae348aeb5660fc2140aec35850c4da997', 1, '', NULL),
(3, '李老师', 'li@designschool.me', 'd033e22ae348aeb5660fc2140aec35850c4da997', 2, '', NULL);

-- ============================================================
-- 3. 用户 (Users) - 密码: admin
-- ============================================================
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `registered_at`, `last_visit_at`, `verification_code`, `verification_verified`, `schools`) VALUES
(1, '王小明', 'xiaoming@example.com', '13800138001', 'd033e22ae348aeb5660fc2140aec35850c4da997', '2025-02-01 10:00:00', '2025-06-01 08:30:00', '', 1, '[1]'),
(2, '赵小红', 'xiaohong@example.com', '13800138002', 'd033e22ae348aeb5660fc2140aec35850c4da997', '2025-03-10 14:00:00', '2025-05-28 16:45:00', '', 1, '[1,2]'),
(3, '陈大伟', 'dawei@example.com', '', 'd033e22ae348aeb5660fc2140aec35850c4da997', '2025-04-20 09:00:00', '2025-04-20 09:00:00', 'ABC123', 0, NULL);

-- ============================================================
-- 4. 学生 (Students) - 密码: admin
-- ============================================================
INSERT INTO `students` (`id`, `name`, `email`, `password`, `registered_at`, `last_visit_at`, `school_id`, `available_modules`, `available_courses`, `available_offers`, `verification_code`, `verification_verified`, `session_refresh_token`, `session_expires_at`, `blocked`) VALUES
(1, '刘同学', 'student1@example.com', 'd033e22ae348aeb5660fc2140aec35850c4da997', '2025-02-15 10:00:00', '2025-06-10 14:30:00', 1, '[1,2,3,4]', '[1]', '[1,2]', '', 1, '', NULL, 0),
(2, '周同学', 'student2@example.com', 'd033e22ae348aeb5660fc2140aec35850c4da997', '2025-03-01 11:00:00', '2025-06-08 09:15:00', 1, '[1,2]', '[1]', '[1]', '', 1, '', NULL, 0),
(3, '吴同学', 'student3@example.com', 'd033e22ae348aeb5660fc2140aec35850c4da997', '2025-04-10 08:00:00', '2025-05-20 17:00:00', 1, '[]', '[]', '[]', '', 0, '', NULL, 0),
(4, '孙同学', 'student4@example.com', 'd033e22ae348aeb5660fc2140aec35850c4da997', '2025-05-01 12:00:00', '2025-05-01 12:00:00', 1, '[]', '[]', '[]', '', 0, '', NULL, 1),
(5, '林同学', 'student5@designschool.me', 'd033e22ae348aeb5660fc2140aec35850c4da997', '2025-04-01 09:00:00', '2025-06-12 10:00:00', 2, '[5,6]', '[2]', '[3]', '', 1, '', NULL, 0);

-- ============================================================
-- 5. 课程 (Courses)
-- ============================================================
INSERT INTO `courses` (`id`, `name`, `code`, `description`, `color`, `image_url`, `created_at`, `updated_at`, `published`) VALUES
(1, 'Go 语言全栈开发', 'GO-FULLSTACK-2025', '从零开始学习 Go 语言，涵盖基础语法、并发编程、Web 开发、微服务架构等核心内容', '#00ADD8', 'https://storage.ultrathreads.me/courses/go-fullstack.jpg', '2025-01-10 00:00:00', '2025-05-20 00:00:00', 1),
(2, 'UI/UX 设计入门到精通', 'UIUX-2025', '学习用户界面与用户体验设计的核心原则，掌握 Figma 工具，完成真实项目设计', '#EC4899', 'https://storage.ultrathreads.me/courses/uiux-design.jpg', '2025-02-01 00:00:00', '2025-06-01 00:00:00', 1),
(3, 'Python 数据分析', 'PYTHON-DATA-2025', '使用 Python 进行数据清洗、可视化与机器学习入门', '#3776AB', 'https://storage.ultrathreads.me/courses/python-data.jpg', '2025-03-15 00:00:00', '2025-03-15 00:00:00', 0);

-- ============================================================
-- 6. 课时 (Lessons)
-- ============================================================
INSERT INTO `lessons` (`id`, `name`, `position`, `published`, `content`, `school_id`) VALUES
-- Go 课程 - 模块1 的课时
(1, 'Go 语言简介与环境搭建', 1, 1, '<h2>Go 语言简介</h2><p>Go 是 Google 开发的静态强类型、编译型语言。</p><h3>环境搭建</h3><p>访问 golang.org 下载安装包...</p>', 1),
(2, '变量、数据类型与运算符', 2, 1, '<h2>变量声明</h2><p>使用 var 关键字或 := 短声明语法。</p><pre><code>var name string = "hello"\nage := 25</code></pre>', 1),
(3, '流程控制语句', 3, 1, '<h2>if/else 与 switch</h2><p>Go 的 if 语句不需要括号。</p>', 1),
(4, '函数与方法', 4, 1, '<h2>函数定义</h2><p>Go 支持多返回值和命名返回值。</p>', 1),
-- Go 课程 - 模块2 的课时
(5, '结构体与接口', 1, 1, '<h2>结构体</h2><p>结构体是用户自定义的类型。</p>', 1),
(6, '并发编程 - Goroutine', 2, 1, '<h2>Goroutine</h2><p>使用 go 关键字启动轻量级线程。</p>', 1),
(7, '并发编程 - Channel', 3, 1, '<h2>Channel</h2><p>Channel 是 goroutine 之间通信的管道。</p>', 1),
(8, 'Web 开发 - Gin 框架', 4, 1, '<h2>Gin Web 框架</h2><p>Gin 是一个高性能的 HTTP Web 框架。</p>', 1),
-- Go 课程 - 模块3 的课时
(9, '微服务架构概述', 1, 1, '<h2>微服务</h2><p>微服务是一种将应用拆分为小型服务的架构风格。</p>', 1),
(10, 'Docker 容器化部署', 2, 1, '<h2>Docker</h2><p>使用 Docker 容器化部署微服务应用。</p>', 1),
-- 设计课程 - 模块4 的课时
(11, '设计基础 - 色彩与排版', 1, 1, '<h2>色彩理论</h2><p>了解色彩的基本原理和搭配方法。</p>', 2),
(12, 'Figma 工具入门', 2, 1, '<h2>Figma 入门</h2><p>Figma 是一款基于浏览器的设计工具。</p>', 2),
(13, '用户体验研究方法', 3, 1, '<h2>UX 研究</h2><p>用户访谈、问卷调查、可用性测试等方法。</p>', 2),
-- 设计课程 - 模块5 的课时
(14, '移动端 UI 设计实战', 1, 1, '<h2>移动端设计</h2><p>学习 iOS 和 Android 的设计规范。</p>', 2),
(15, '设计系统搭建', 2, 1, '<h2>设计系统</h2><p>建立统一的设计语言和组件库。</p>', 2);

-- ============================================================
-- 7. 课时内容 (LessonContents)
-- ============================================================
INSERT INTO `lesson_contents` (`lesson_id`, `school_id`, `content`) VALUES
(1, 1, '<h2>Go 语言简介</h2><p>Go 是 Google 于 2009 年发布的静态强类型、编译型语言。</p><h3>安装步骤</h3><ol><li>访问 golang.org/dl</li><li>下载对应操作系统的安装包</li><li>配置 GOPATH 环境变量</li><li>验证安装: go version</li></ol>'),
(2, 1, '<h2>变量与数据类型</h2><pre><code>package main\nimport "fmt"\nfunc main() {\n    var name string = "UltraThreads"\n    age := 18\n    fmt.Println(name, age)\n}</code></pre>'),
(5, 1, '<h2>结构体定义</h2><pre><code>type Student struct {\n    Name  string\n    Email string\n    Age   int\n}</code></pre>');

-- ============================================================
-- 8. 模块 (Modules) - lessons 和 survey 以 JSON 存储
-- ============================================================
INSERT INTO `modules` (`id`, `name`, `position`, `published`, `course_id`, `package_id`, `school_id`, `lessons`, `survey`) VALUES
(1, 'Go 语言基础', 1, 1, 1, 1, 1,
 '[{"id":1,"name":"Go 语言简介与环境搭建","position":1,"published":true,"content":"","schoolId":1},{"id":2,"name":"变量、数据类型与运算符","position":2,"published":true,"content":"","schoolId":1},{"id":3,"name":"流程控制语句","position":3,"published":true,"content":"","schoolId":1},{"id":4,"name":"函数与方法","position":4,"published":true,"content":"","schoolId":1}]',
 '{"title":"Go 基础模块测验","questions":[{"id":1,"question":"Go 语言是哪个公司开发的?","answerType":"single","answerOptions":["Google","Facebook","Microsoft","Apple"]},{"id":2,"question":"以下哪些是 Go 的基本数据类型?","answerType":"multiple","answerOptions":["string","int","float","array"]}],"required":true}'),

(2, 'Go 进阶 - 面向对象与并发', 2, 1, 1, 1, 1,
 '[{"id":5,"name":"结构体与接口","position":1,"published":true,"content":"","schoolId":1},{"id":6,"name":"并发编程 - Goroutine","position":2,"published":true,"content":"","schoolId":1},{"id":7,"name":"并发编程 - Channel","position":3,"published":true,"content":"","schoolId":1}]',
 '{"title":"Go 进阶模块测验","questions":[{"id":1,"question":"Goroutine 比线程更轻量吗?","answerType":"single","answerOptions":["是","否"]}],"required":true}'),

(3, 'Go Web 开发', 3, 1, 1, 2, 1,
 '[{"id":8,"name":"Web 开发 - Gin 框架","position":1,"published":true,"content":"","schoolId":1}]',
 NULL),

(4, '微服务与部署', 4, 1, 1, 2, 1,
 '[{"id":9,"name":"微服务架构概述","position":1,"published":true,"content":"","schoolId":1},{"id":10,"name":"Docker 容器化部署","position":2,"published":true,"content":"","schoolId":1}]',
 NULL),

-- 设计课程模块
(5, '设计基础', 1, 1, 2, 3, 2,
 '[{"id":11,"name":"设计基础 - 色彩与排版","position":1,"published":true,"content":"","schoolId":2},{"id":12,"name":"Figma 工具入门","position":2,"published":true,"content":"","schoolId":2},{"id":13,"name":"用户体验研究方法","position":3,"published":true,"content":"","schoolId":2}]',
 '{"title":"设计基础测验","questions":[{"id":1,"question":"RGB 颜色模式用于什么场景?","answerType":"single","answerOptions":["屏幕显示","印刷","两者都是"]}],"required":true}'),

(6, 'UI 设计实战', 2, 1, 2, 4, 2,
 '[{"id":14,"name":"移动端 UI 设计实战","position":1,"published":true,"content":"","schoolId":2},{"id":15,"name":"设计系统搭建","position":2,"published":true,"content":"","schoolId":2}]',
 NULL);

-- ============================================================
-- 9. 套餐 (Packages)
-- ============================================================
INSERT INTO `packages` (`id`, `name`, `course_id`, `school_id`) VALUES
(1, 'Go 基础套餐', 1, 1),
(2, 'Go 全栈套餐', 1, 1),
(3, '设计入门套餐', 2, 2),
(4, '设计进阶套餐', 2, 2);

-- ============================================================
-- 10. 优惠/商品 (Offers)
-- ============================================================
INSERT INTO `offers` (`id`, `name`, `description`, `benefits`, `school_id`, `packages`, `price_value`, `price_currency`, `payment_method_uses_provider`, `payment_method_provider`) VALUES
(1, 'Go 语言基础班', '适合零基础学员，掌握 Go 语言核心语法', '["4个基础模块","课后练习","社区答疑","结业证书"]', 1, '[1]', 19900, 'CNY', 0, ''),
(2, 'Go 全栈精英班', '从基础到微服务架构，全面掌握 Go 全栈开发', '["全部模块","1对1辅导","项目实战","内推机会","结业证书"]', 1, '[1,2]', 49900, 'CNY', 0, ''),
(3, 'UI/UX 设计全能班', '从设计基础到实战项目，成为全能设计师', '["全部模块","Figma 正版授权","作品集指导","就业推荐"]', 2, '[3,4]', 39900, 'CNY', 0, '');

-- ============================================================
-- 11. 优惠码 (PromoCodes)
-- ============================================================
INSERT INTO `promo_codes` (`id`, `school_id`, `code`, `discount_percentage`, `expires_at`, `offer_i_ds`) VALUES
(1, 1, 'WELCOME20', 20, '2026-12-31 23:59:59', '[1,2]'),
(2, 1, 'NEWYEAR50', 50, '2025-01-31 23:59:59', '[2]'),
(3, 2, 'DESIGN10', 10, '2026-06-30 23:59:59', '[3]'),
(4, 1, 'VIP30', 30, '2026-12-31 23:59:59', '[1,2]');

-- ============================================================
-- 12. 订单 (Orders)
-- ============================================================
INSERT INTO `orders` (`id`, `school_id`, `student`, `offer`, `promo`, `created_at`, `amount`, `currency`, `status`, `transactions`) VALUES
(1, 1, '{"id":1,"name":"刘同学","email":"student1@example.com"}', '{"id":2,"name":"Go 全栈精英班"}', '{"id":1,"code":"WELCOME20"}', '2025-03-01 10:00:00', 39920, 'CNY', 'paid', '[{"status":"approved","createdAt":"2025-03-01T10:05:00Z","additionalInfo":"支付成功"}]'),
(2, 1, '{"id":2,"name":"周同学","email":"student2@example.com"}', '{"id":1,"name":"Go 语言基础班"}', NULL, '2025-03-15 14:30:00', 19900, 'CNY', 'paid', '[{"status":"approved","createdAt":"2025-03-15T14:35:00Z","additionalInfo":"支付成功"}]'),
(3, 1, '{"id":3,"name":"吴同学","email":"student3@example.com"}', '{"id":2,"name":"Go 全栈精英班"}', NULL, '2025-05-01 09:00:00', 49900, 'CNY', 'created', '[]'),
(4, 2, '{"id":5,"name":"林同学","email":"student5@designschool.me"}', '{"id":3,"name":"UI/UX 设计全能班"}', '{"id":3,"code":"DESIGN10"}', '2025-04-15 11:00:00', 35910, 'CNY', 'paid', '[{"status":"approved","createdAt":"2025-04-15T11:02:00Z","additionalInfo":"支付成功"}]'),
(5, 1, '{"id":1,"name":"刘同学","email":"student1@example.com"}', '{"id":1,"name":"Go 语言基础班"}', NULL, '2025-06-01 16:00:00', 19900, 'CNY', 'failed', '[{"status":"declined","createdAt":"2025-06-01T16:01:00Z","additionalInfo":"余额不足"}]');

-- ============================================================
-- 13. 文件 (Files)
-- ============================================================
INSERT INTO `files` (`id`, `school_id`, `type`, `content_type`, `name`, `size`, `status`, `upload_started_at`, `url`) VALUES
(1, 1, 'image', 'image/jpeg', 'go-fullstack-cover.jpg', 245760, 4, '2025-01-10 00:00:00', 'https://storage.ultrathreads.me/courses/go-fullstack.jpg'),
(2, 1, 'image', 'image/png', 'go-architecture.png', 189440, 4, '2025-02-01 00:00:00', 'https://storage.ultrathreads.me/courses/go-architecture.png'),
(3, 2, 'image', 'image/jpeg', 'uiux-design-cover.jpg', 312320, 4, '2025-02-01 00:00:00', 'https://storage.ultrathreads.me/courses/uiux-design.jpg'),
(4, 1, 'video', 'video/mp4', 'go-intro-lecture.mp4', 52428800, 4, '2025-01-15 00:00:00', 'https://storage.ultrathreads.me/videos/go-intro.mp4'),
(5, 1, 'image', 'image/png', 'school-logo.png', 51200, 4, '2025-01-01 00:00:00', 'https://storage.ultrathreads.me/logo.png'),
(6, 1, 'other', 'application/pdf', 'go-cheatsheet.pdf', 102400, 1, '2025-06-10 00:00:00', ''),
(7, 2, 'image', 'image/png', 'figma-components.png', 204800, 2, '2025-06-12 00:00:00', '');

-- ============================================================
-- 14. 学生学习进度 (StudentLessons)
-- ============================================================
INSERT INTO `student_lessons` (`student_id`, `finished`, `last_opened`) VALUES
(1, '[1,2,3,4,5,6,7,8]', 8),
(2, '[1,2,3]', 3),
(5, '[11,12]', 12);

-- ============================================================
-- 15. 问卷调查结果 (SurveyResults)
-- ============================================================
INSERT INTO `survey_results` (`id`, `student`, `module_id`, `submitted_at`, `answers`) VALUES
(1, '{"id":1,"name":"刘同学","email":"student1@example.com"}', 1, '2025-03-20 15:00:00', '[{"questionId":1,"answer":"Google"},{"questionId":2,"answer":"string,int,float"}]'),
(2, '{"id":1,"name":"刘同学","email":"student1@example.com"}', 2, '2025-04-10 16:30:00', '[{"questionId":1,"answer":"是"}]'),
(3, '{"id":2,"name":"周同学","email":"student2@example.com"}', 1, '2025-04-01 10:00:00', '[{"questionId":1,"answer":"Google"},{"questionId":2,"answer":"string,int"}]'),
(4, '{"id":5,"name":"林同学","email":"student5@designschool.me"}', 5, '2025-05-10 14:00:00', '[{"questionId":1,"answer":"屏幕显示"}]');

-- ============================================================
-- 数据说明
-- ============================================================
-- 管理员账号:
--   admin@admin.com / admin       (UltraThreads Academy)
--   zhang@ultrathreads.me / admin (UltraThreads Academy)
--   li@designschool.me / admin    (Creative Design School)
--
-- 学生账号:
--   student1@example.com / admin   (刘同学 - 已购买Go全栈, 学习进度8课时)
--   student2@example.com / admin   (周同学 - 已购买Go基础, 学习进度3课时)
--   student3@example.com / admin   (吴同学 - 未购买, 未验证邮箱)
--   student4@example.com / admin   (孙同学 - 已封禁)
--   student5@designschool.me / admin (林同学 - 设计学校, 已购买设计课程)
--
-- 用户账号:
--   xiaoming@example.com / admin   (王小明 - 关联学校1)
--   xiaohong@example.com / admin   (赵小红 - 关联学校1和2)
--   dawei@example.com / admin      (陈大伟 - 未验证邮箱)
--
-- 优惠码:
--   WELCOME20 - 8折优惠 (学校1, 有效期至2026年底)
--   VIP30     - 7折优惠 (学校1, 有效期至2026年底)
--   DESIGN10  - 9折优惠 (学校2, 有效期至2026年中)
--   NEWYEAR50 - 5折优惠 (已过期)
--
-- 订单状态:
--   订单1: 已支付 (Go全栈, 使用WELCOME20优惠码, 实付399.20元)
--   订单2: 已支付 (Go基础, 无优惠, 实付199.00元)
--   订单3: 待支付 (Go全栈, 未使用优惠)
--   订单4: 已支付 (设计课程, 使用DESIGN10优惠码, 实付359.10元)
--   订单5: 支付失败 (Go基础, 余额不足)
