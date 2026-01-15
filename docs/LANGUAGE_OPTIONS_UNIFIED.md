# 语言选项统一说明

## 问题描述

之前在创建片段和编辑片段时，语言选项的定义不一致：

- `EditorModal.tsx` - 只定义了 `value` 和 `label`
- `QuickSaveDialog.tsx` - 定义了 `value`、`label` 和 `type`

这导致两个界面的行为可能不一致。

## 解决方案

创建了统一的语言配置文件：`src/constants/languages.ts`

### 核心文件

```typescript
// src/constants/languages.ts
export interface LanguageOption {
  value: string;      // 语言标识符（如 'javascript'）
  label: string;      // 显示名称（如 'JavaScript'）
  type: ContentType;  // 内容类型：'code' | 'sql' | 'text'
}

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
```

### 工具函数

```typescript
// 根据语言值获取对应的类型
export function getTypeByLanguage(language: string): ContentType {
  const option = LANGUAGE_OPTIONS.find(opt => opt.value === language);
  return option?.type || 'code';
}

// 根据语言值获取标签
export function getLabelByLanguage(language: string): string {
  const option = LANGUAGE_OPTIONS.find(opt => opt.value === language);
  return option?.label || language;
}
```

## 使用方法

### 在组件中导入

```typescript
import { LANGUAGE_OPTIONS, getTypeByLanguage, getLabelByLanguage } from '../../constants/languages';
```

### 渲染下拉选择框

```typescript
<select
  value={language}
  onChange={(e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    setType(getTypeByLanguage(newLanguage));  // 自动设置类型
  }}
>
  {LANGUAGE_OPTIONS.map((lang) => (
    <option key={lang.value} value={lang.value}>
      {lang.label}
    </option>
  ))}
</select>
```

### 获取语言标签

```typescript
const label = getLabelByLanguage(language);
// 或
const label = LANGUAGE_OPTIONS.find(l => l.value === language)?.label;
```

## 已更新的文件

1. ✅ `src/constants/languages.ts` - 新建统一配置
2. ✅ `src/components/Editor/EditorModal.tsx` - 使用统一配置
3. ✅ `src/components/QuickSave/QuickSaveDialog.tsx` - 使用统一配置

## 优势

### 1. 一致性
- ✅ 创建和编辑使用相同的语言列表
- ✅ 语言到类型的映射统一
- ✅ 显示名称统一

### 2. 可维护性
- ✅ 只需在一个地方添加新语言
- ✅ 类型安全（TypeScript）
- ✅ 避免重复代码

### 3. 扩展性
- ✅ 易于添加新语言
- ✅ 易于添加更多属性（如图标、文件扩展名等）

## 如何添加新语言

在 `src/constants/languages.ts` 中添加：

```typescript
export const LANGUAGE_OPTIONS: LanguageOption[] = [
  // ... 现有语言 ...
  { value: 'go', label: 'Go', type: 'code' },  // 新增
  { value: 'rust', label: 'Rust', type: 'code' },  // 新增
];
```

然后在 Prism 导入中添加对应的语法高亮：

```typescript
// 在 EditorModal.tsx 和 QuickSaveDialog.tsx 中
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';

// 在 getPrismLanguage 函数中添加映射
const languageMap: Record<string, any> = {
  // ... 现有映射 ...
  go: languages.go,
  rust: languages.rust,
};
```

## 测试清单

- [x] 创建新片段时语言选择正确
- [x] 编辑现有片段时语言显示正确
- [x] 语言变更时类型自动更新
- [x] 所有语言的语法高亮正常
- [x] 没有 TypeScript 错误

## 相关文档

- [Prism.js 支持的语言](https://prismjs.com/#supported-languages)
- [TypeScript 类型定义](../src/types/index.ts)
