/**
 * 变量/占位符工具函数
 * 用于处理代码片段中的 ${变量名} 格式的占位符
 */

/**
 * 从文本中提取所有变量占位符
 * @param text - 包含占位符的文本
 * @returns 变量名数组（去重）
 * @example
 * extractVariables("SELECT * FROM ${TABLE_NAME} WHERE id = ${USER_ID}")
 * // 返回: ["TABLE_NAME", "USER_ID"]
 */
export function extractVariables(text: string): string[] {
  const regex = /\$\{([^}]+)\}/g;
  const variables = new Set<string>();
  let match;

  while ((match = regex.exec(text)) !== null) {
    const varName = match[1].trim();
    if (varName) {
      variables.add(varName);
    }
  }

  return Array.from(variables);
}

/**
 * 替换文本中的变量占位符
 * @param text - 包含占位符的文本
 * @param values - 变量名到值的映射
 * @returns 替换后的文本
 * @example
 * replaceVariables(
 *   "SELECT * FROM ${TABLE_NAME} WHERE id = ${USER_ID}",
 *   { TABLE_NAME: "users", USER_ID: "123" }
 * )
 * // 返回: "SELECT * FROM users WHERE id = 123"
 */
export function replaceVariables(
  text: string,
  values: Record<string, string>
): string {
  return text.replace(/\$\{([^}]+)\}/g, (match, varName) => {
    const trimmedName = varName.trim();
    return values[trimmedName] !== undefined ? values[trimmedName] : match;
  });
}

/**
 * 检查文本是否包含变量占位符
 * @param text - 要检查的文本
 * @returns 是否包含占位符
 */
export function hasVariables(text: string): boolean {
  return /\$\{[^}]+\}/.test(text);
}

/**
 * 验证变量名是否有效
 * @param varName - 变量名
 * @returns 是否有效
 */
export function isValidVariableName(varName: string): boolean {
  // 变量名应该只包含字母、数字、下划线
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(varName);
}

/**
 * 高亮显示占位符（用于预览）
 * @param text - 包含占位符的文本
 * @returns 带有高亮标记的HTML字符串
 */
export function highlightVariables(text: string): string {
  return text.replace(
    /\$\{([^}]+)\}/g,
    '<span class="variable-placeholder">${$1}</span>'
  );
}
