-- 为 contents 表添加标签支持
-- 在 Supabase SQL 编辑器中执行此脚本

-- 1. 添加 tags 列（如果还不存在）
ALTER TABLE contents ADD COLUMN IF NOT EXISTS tags text[];

-- 2. 为 tags 创建 GIN 索引以优化查询性能
-- GIN 索引特别适合数组类型的列
CREATE INDEX IF NOT EXISTS idx_contents_tags ON contents USING GIN (tags);

-- 3. （可选）为现有数据添加默认标签
-- 取消注释以下行来根据类型自动添加标签
/*
UPDATE contents 
SET tags = ARRAY[type] 
WHERE tags IS NULL;
*/

-- 4. 验证更改
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'contents' AND column_name = 'tags';

-- 完成！现在你可以使用标签功能了
