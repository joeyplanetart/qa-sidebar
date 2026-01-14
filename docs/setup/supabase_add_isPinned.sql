-- 添加置顶字段到 contents 表
-- 在 Supabase SQL 编辑器中运行此脚本

-- 1. 添加 isPinned 列（如果不存在）
ALTER TABLE contents 
ADD COLUMN IF NOT EXISTS "isPinned" boolean DEFAULT false;

-- 2. 为现有数据设置默认值
UPDATE contents 
SET "isPinned" = false 
WHERE "isPinned" IS NULL;

-- 3. 创建索引以优化查询性能（可选）
CREATE INDEX IF NOT EXISTS idx_contents_isPinned 
ON contents("isPinned", "createdAt" DESC);

-- 4. 验证字段已添加
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'contents' AND column_name = 'isPinned';
