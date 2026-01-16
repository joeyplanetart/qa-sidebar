-- =============================================
-- 诊断查询：检查数据和权限问题
-- =============================================

-- 1. 检查当前用户信息
SELECT 
    auth.uid() as current_user_id,
    auth.email() as current_user_email;

-- 2. 查看所有数据（绕过 RLS，需要管理员权限）
-- 如果看不到数据，说明 RLS 策略有问题
SELECT 
    id,
    "userId",
    type,
    title,
    language,
    "createdAt"
FROM public.contents
ORDER BY "createdAt" DESC;

-- 3. 检查 RLS 策略
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'contents';

-- 4. 检查 userId 和 auth.uid() 是否匹配
SELECT 
    "userId",
    auth.uid()::text as auth_uid,
    CASE 
        WHEN "userId" = auth.uid()::text THEN '✅ 匹配'
        ELSE '❌ 不匹配'
    END as match_status,
    title
FROM public.contents
ORDER BY "createdAt" DESC;

-- =============================================
-- 可能的问题和解决方案
-- =============================================

-- 问题 1: userId 格式不匹配
-- 症状：数据存在但查询不到
-- 原因：保存时 userId 是字符串，但 RLS 策略用 auth.uid() 比较
-- 解决：确保 userId 和 auth.uid()::text 一致

-- 问题 2: RLS 策略阻止访问
-- 症状：管理员能看到数据，普通用户看不到
-- 解决：临时禁用 RLS 测试
-- ALTER TABLE public.contents DISABLE ROW LEVEL SECURITY;

-- 问题 3: 用户未登录
-- 症状：auth.uid() 返回 null
-- 解决：确保用户已登录

-- =============================================
-- 快速修复：如果 userId 不匹配
-- =============================================

-- 查看当前的 userId 值
SELECT DISTINCT "userId" FROM public.contents;

-- 如果需要更新 userId 为当前用户
-- UPDATE public.contents 
-- SET "userId" = auth.uid()::text 
-- WHERE "userId" != auth.uid()::text;

-- =============================================
-- 测试查询（不受 RLS 影响）
-- =============================================

-- 作为管理员查看所有数据
SELECT COUNT(*) as total_records FROM public.contents;

-- 查看特定用户的数据
-- SELECT * FROM public.contents WHERE "userId" = 'YOUR_USER_ID';
