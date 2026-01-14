/**
 * 用户头像生成工具
 * 基于用户 ID 生成一致的头像
 */

// 20 种渐变色方案
const avatarGradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // 紫色
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // 粉红
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // 蓝色
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // 绿色
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // 粉黄
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', // 青紫
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', // 薄荷粉
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', // 粉色系
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', // 橙色系
  'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)', // 红蓝
  'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)', // 紫蓝
  'linear-gradient(135deg, #f8b500 0%, #fceabb 100%)', // 金色
  'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)', // 黄青
  'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', // 天蓝
  'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', // 橙黄
  'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', // 粉蓝
  'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)', // 紫粉
  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', // 浅蓝
  'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', // 紫黄
  'linear-gradient(135deg, #fee140 0%, #fa709a 100%)', // 黄粉
];

// 20 种背景图案（使用 SVG pattern）
const avatarPatterns = [
  // 圆点
  `<pattern id="pattern0" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
    <circle cx="10" cy="10" r="2" fill="white" opacity="0.3"/>
  </pattern>`,
  // 网格
  `<pattern id="pattern1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
    <path d="M 0 10 L 20 10 M 10 0 L 10 20" stroke="white" stroke-width="1" opacity="0.2"/>
  </pattern>`,
  // 对角线
  `<pattern id="pattern2" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
    <path d="M 0 0 L 20 20" stroke="white" stroke-width="2" opacity="0.2"/>
  </pattern>`,
  // 波浪
  `<pattern id="pattern3" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
    <path d="M 0 10 Q 10 0 20 10 T 40 10" stroke="white" stroke-width="2" fill="none" opacity="0.3"/>
  </pattern>`,
  // 星星
  `<pattern id="pattern4" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
    <path d="M 15 5 L 17 12 L 24 12 L 18 16 L 20 23 L 15 19 L 10 23 L 12 16 L 6 12 L 13 12 Z" fill="white" opacity="0.2"/>
  </pattern>`,
  // 方块
  `<pattern id="pattern5" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
    <rect x="5" y="5" width="10" height="10" fill="white" opacity="0.2"/>
  </pattern>`,
  // 三角形
  `<pattern id="pattern6" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
    <path d="M 15 5 L 25 20 L 5 20 Z" fill="white" opacity="0.2"/>
  </pattern>`,
  // 六边形
  `<pattern id="pattern7" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
    <path d="M 15 0 L 28 7.5 L 28 22.5 L 15 30 L 2 22.5 L 2 7.5 Z" fill="none" stroke="white" stroke-width="2" opacity="0.2"/>
  </pattern>`,
  // 菱形
  `<pattern id="pattern8" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
    <path d="M 10 0 L 20 10 L 10 20 L 0 10 Z" fill="white" opacity="0.2"/>
  </pattern>`,
  // 加号
  `<pattern id="pattern9" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
    <path d="M 10 0 L 10 20 M 0 10 L 20 10" stroke="white" stroke-width="2" opacity="0.3"/>
  </pattern>`,
  // 交叉线
  `<pattern id="pattern10" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
    <path d="M 0 0 L 20 20 M 20 0 L 0 20" stroke="white" stroke-width="1" opacity="0.2"/>
  </pattern>`,
  // 箭头
  `<pattern id="pattern11" x="0" y="0" width="30" height="20" patternUnits="userSpaceOnUse">
    <path d="M 5 10 L 15 5 L 15 15 Z" fill="white" opacity="0.3"/>
  </pattern>`,
  // 心形
  `<pattern id="pattern12" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
    <path d="M 15 25 C 15 25 5 18 5 12 C 5 8 8 5 12 7 C 14 8 15 10 15 10 C 15 10 16 8 18 7 C 22 5 25 8 25 12 C 25 18 15 25 15 25 Z" fill="white" opacity="0.2"/>
  </pattern>`,
  // 花朵
  `<pattern id="pattern13" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
    <circle cx="20" cy="20" r="4" fill="white" opacity="0.3"/>
    <circle cx="20" cy="10" r="3" fill="white" opacity="0.2"/>
    <circle cx="20" cy="30" r="3" fill="white" opacity="0.2"/>
    <circle cx="10" cy="20" r="3" fill="white" opacity="0.2"/>
    <circle cx="30" cy="20" r="3" fill="white" opacity="0.2"/>
  </pattern>`,
  // 叶子
  `<pattern id="pattern14" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
    <path d="M 5 15 Q 5 5 15 5 Q 15 15 5 15 Z" fill="white" opacity="0.2"/>
  </pattern>`,
  // 月亮
  `<pattern id="pattern15" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
    <path d="M 15 5 A 10 10 0 1 0 15 25 A 7 7 0 1 1 15 5 Z" fill="white" opacity="0.2"/>
  </pattern>`,
  // 闪电
  `<pattern id="pattern16" x="0" y="0" width="20" height="30" patternUnits="userSpaceOnUse">
    <path d="M 12 0 L 8 12 L 13 12 L 8 30 L 15 10 L 10 10 Z" fill="white" opacity="0.3"/>
  </pattern>`,
  // 雪花
  `<pattern id="pattern17" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M 20 0 L 20 40 M 0 20 L 40 20 M 5 5 L 35 35 M 35 5 L 5 35" stroke="white" stroke-width="1" opacity="0.2"/>
  </pattern>`,
  // 水滴
  `<pattern id="pattern18" x="0" y="0" width="30" height="40" patternUnits="userSpaceOnUse">
    <path d="M 15 5 C 15 5 5 15 5 25 C 5 32 10 35 15 35 C 20 35 25 32 25 25 C 25 15 15 5 15 5 Z" fill="white" opacity="0.2"/>
  </pattern>`,
  // 音符
  `<pattern id="pattern19" x="0" y="0" width="30" height="40" patternUnits="userSpaceOnUse">
    <circle cx="10" cy="30" r="4" fill="white" opacity="0.3"/>
    <rect x="14" y="10" width="2" height="20" fill="white" opacity="0.3"/>
    <path d="M 14 10 Q 20 8 20 15" stroke="white" stroke-width="2" fill="none" opacity="0.3"/>
  </pattern>`,
];

/**
 * 根据字符串生成一个稳定的哈希值
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * 生成用户头像 SVG
 * @param userId 用户 ID
 * @param displayName 用户显示名称（用于显示首字母）
 * @param size 头像尺寸（默认 40px）
 */
export function generateAvatar(
  userId: string,
  displayName: string | null,
  size: number = 40
): string {
  const hash = hashCode(userId);
  
  // 根据 hash 选择渐变色和图案
  const gradientIndex = hash % avatarGradients.length;
  const patternIndex = Math.floor(hash / avatarGradients.length) % avatarPatterns.length;
  
  const gradient = avatarGradients[gradientIndex];
  const pattern = avatarPatterns[patternIndex];
  
  // 获取显示名称的首字母
  let initial = '?';
  if (displayName) {
    // 如果是中文，取第一个字；如果是英文，取第一个字母
    initial = displayName.charAt(0).toUpperCase();
  }
  
  // 生成 SVG
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad${hash}" x1="0%" y1="0%" x2="100%" y2="100%">
          ${gradientToStops(gradient)}
        </linearGradient>
        ${pattern}
      </defs>
      
      <!-- 背景圆形（渐变色） -->
      <circle cx="50" cy="50" r="50" fill="url(#grad${hash})"/>
      
      <!-- 图案层 -->
      <circle cx="50" cy="50" r="50" fill="url(#pattern${patternIndex})"/>
      
      <!-- 文字 -->
      <text
        x="50"
        y="50"
        text-anchor="middle"
        dominant-baseline="central"
        font-family="Arial, sans-serif"
        font-size="40"
        font-weight="bold"
        fill="white"
        style="text-shadow: 0 2px 4px rgba(0,0,0,0.2);"
      >${initial}</text>
    </svg>
  `;
  
  // 转换为 data URL
  // 使用 encodeURIComponent 来支持中文和其他 Unicode 字符
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * 将 CSS 渐变字符串转换为 SVG stops
 */
function gradientToStops(gradient: string): string {
  // 提取颜色值
  const matches = gradient.match(/#[0-9a-fA-F]{6}/g);
  if (!matches || matches.length < 2) {
    return '<stop offset="0%" stop-color="#667eea"/><stop offset="100%" stop-color="#764ba2"/>';
  }
  
  return `<stop offset="0%" stop-color="${matches[0]}"/><stop offset="100%" stop-color="${matches[1]}"/>`;
}

/**
 * 获取用户头像 URL
 * 如果用户有 photoURL 则使用，否则生成随机头像
 */
export function getUserAvatar(
  userId: string,
  displayName: string | null,
  photoURL: string | null,
  size: number = 40
): string {
  if (photoURL) {
    return photoURL;
  }
  
  return generateAvatar(userId, displayName, size);
}
