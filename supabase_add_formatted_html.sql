-- 为 contents 表添加富文本 HTML 支持
-- 在 Supabase SQL 编辑器中执行此脚本

-- 1. 添加 formattedHtml 列（如果还不存在）
-- 这个列用于存储从网页选中保存时的原始 HTML 样式
ALTER TABLE contents ADD COLUMN IF NOT EXISTS "formattedHtml" text;

-- 2. 验证更改
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'contents' AND column_name = 'formattedHtml';

-- 完成！现在右键保存时会保留原始样式了
