-- =============================================
-- QA SidePanel - Supabase 数据库初始化脚本
-- =============================================
-- 
-- 使用说明：
-- 1. 登录 Supabase Dashboard: https://app.supabase.com
-- 2. 选择你的项目
-- 3. 点击左侧 "SQL Editor"
-- 4. 点击 "New Query"
-- 5. 复制下面的整个 SQL 内容并粘贴
-- 6. 点击 "Run" 执行
-- =============================================

-- 1. 删除旧表（如果存在）
DROP TABLE IF EXISTS public.contents;

-- 2. 创建 contents 表
CREATE TABLE public.contents (
    -- 主键
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 用户 ID（关联到 auth.users）
    "userId" TEXT NOT NULL,
    
    -- 内容类型：'code' | 'sql' | 'text'
    type TEXT NOT NULL CHECK (type IN ('code', 'sql', 'text')),
    
    -- 标题
    title TEXT NOT NULL,
    
    -- 内容
    content TEXT NOT NULL,
    
    -- 可选字段：编程语言（当 type = 'code' 时）
    language TEXT,
    
    -- 可选字段：格式化后的 HTML
    "formattedHtml" TEXT,
    
    -- 可选字段：标签数组
    tags TEXT[],
    
    -- 可选字段：变量/占位符列表
    variables TEXT[],
    
    -- 可选字段：是否置顶
    "isPinned" BOOLEAN DEFAULT false,
    
    -- 可选字段：使用次数统计
    "useCount" INTEGER DEFAULT 0,
    
    -- 可选字段：最后使用时间（Unix 时间戳，毫秒）
    "lastUsedAt" BIGINT,
    
    -- 创建时间（Unix 时间戳，毫秒）
    "createdAt" BIGINT NOT NULL,
    
    -- 更新时间（Unix 时间戳，毫秒）
    "updatedAt" BIGINT NOT NULL
);

-- 3. 创建索引以提高查询性能
CREATE INDEX idx_contents_userId ON public.contents("userId");
CREATE INDEX idx_contents_type ON public.contents(type);
CREATE INDEX idx_contents_createdAt ON public.contents("createdAt" DESC);
CREATE INDEX idx_contents_isPinned ON public.contents("isPinned");
CREATE INDEX idx_contents_tags ON public.contents USING GIN(tags);

-- 4. 启用行级安全 (Row Level Security)
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;

-- 5. 创建 RLS 策略

-- 用户可以查看自己的内容
CREATE POLICY "Users can view their own contents"
    ON public.contents
    FOR SELECT
    USING (auth.uid()::text = "userId");

-- 用户可以插入自己的内容
CREATE POLICY "Users can insert their own contents"
    ON public.contents
    FOR INSERT
    WITH CHECK (auth.uid()::text = "userId");

-- 用户可以更新自己的内容
CREATE POLICY "Users can update their own contents"
    ON public.contents
    FOR UPDATE
    USING (auth.uid()::text = "userId")
    WITH CHECK (auth.uid()::text = "userId");

-- 用户可以删除自己的内容
CREATE POLICY "Users can delete their own contents"
    ON public.contents
    FOR DELETE
    USING (auth.uid()::text = "userId");

-- 6. 授予权限
GRANT ALL ON public.contents TO authenticated;
GRANT SELECT ON public.contents TO anon;

-- =============================================
-- 完成！
-- =============================================
-- 
-- 验证步骤：
-- 1. 在 Supabase Dashboard 中点击 "Table Editor"
-- 2. 应该能看到 "contents" 表
-- 3. 检查表结构是否包含所有字段
-- 
-- 测试查询：
-- SELECT * FROM public.contents LIMIT 10;
-- =============================================
