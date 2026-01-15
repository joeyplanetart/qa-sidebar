import type { ContentType } from '../types';

export interface LanguageOption {
  value: string;
  label: string;
  type: ContentType;
}

/**
 * 支持的编程语言列表
 * 统一在创建和编辑时使用
 */
export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: 'javascript', label: 'JavaScript', type: 'code' },
  { value: 'typescript', label: 'TypeScript', type: 'code' },
  { value: 'python', label: 'Python', type: 'code' },
  { value: 'java', label: 'Java', type: 'code' },
  { value: 'sql', label: 'SQL', type: 'sql' },
  { value: 'bash', label: 'Shell/Bash', type: 'code' },
  { value: 'html', label: 'HTML', type: 'code' },
  { value: 'css', label: 'CSS', type: 'code' },
  { value: 'json', label: 'JSON', type: 'code' },
  { value: 'yaml', label: 'YAML', type: 'code' },
  { value: 'markdown', label: 'Markdown', type: 'code' },
  { value: 'plaintext', label: '纯文本', type: 'text' },
];

/**
 * 根据语言值获取对应的类型
 */
export function getTypeByLanguage(language: string): ContentType {
  const option = LANGUAGE_OPTIONS.find(opt => opt.value === language);
  return option?.type || 'code';
}

/**
 * 根据语言值获取标签
 */
export function getLabelByLanguage(language: string): string {
  const option = LANGUAGE_OPTIONS.find(opt => opt.value === language);
  return option?.label || language;
}
