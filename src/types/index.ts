export type ContentType = 'code' | 'sql' | 'text';

export interface ContentItem {
  id: string;
  userId: string;
  type: ContentType;
  title: string;
  content: string;
  language?: string;
  formattedHtml?: string;
  tags?: string[];
  variables?: string[]; // 代码片段中的变量/占位符列表
  isPinned?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface FilterType {
  type: 'all' | ContentType;
  label: string;
}
