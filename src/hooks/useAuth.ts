import { useState, useEffect, useRef } from 'react';
import { onAuthChange } from '../services/supabase';
import { migrateLocalDataToSupabase } from '../utils/migration';
import type { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const hasMigrated = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (newUser) => {
      setUser(newUser);
      setLoading(false);

      // 当用户首次登录时，尝试迁移本地数据
      if (newUser && !hasMigrated.current) {
        hasMigrated.current = true;
        try {
          await migrateLocalDataToSupabase(newUser.uid);
        } catch (error) {
          console.error('自动迁移数据失败:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};
