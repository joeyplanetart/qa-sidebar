import { getFromLocalStorage, clearLocalStorage } from '../services/storage';
import { createContent } from '../services/supabase';

/**
 * 将匿名用户的本地数据迁移到 Supabase
 */
export const migrateLocalDataToSupabase = async (userId: string): Promise<void> => {
  try {
    // 获取本地存储的内容
    const localContents = await getFromLocalStorage();
    
    if (localContents.length === 0) {
      console.log('没有需要迁移的本地数据');
      return;
    }

    console.log(`开始迁移 ${localContents.length} 条本地数据...`);

    // 逐个迁移到 Supabase
    for (const content of localContents) {
      try {
        // 创建新的内容，使用当前用户 ID
        await createContent({
          userId,
          type: content.type,
          title: content.title,
          content: content.content,
          language: content.language,
          formattedHtml: content.formattedHtml,
          tags: content.tags,
          createdAt: content.createdAt,
          updatedAt: content.updatedAt,
        });
      } catch (error) {
        console.error('迁移单个内容失败:', error);
      }
    }

    // 迁移完成后清空本地存储
    await clearLocalStorage();
    console.log('数据迁移完成');
  } catch (error) {
    console.error('数据迁移失败:', error);
    throw error;
  }
};
