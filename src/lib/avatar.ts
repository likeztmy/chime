/**
 * 头像生成工具函数
 * 支持 DiceBear 提供的多种风格:
 * - avataaars (卡通人物)
 * - bottts (机器人)
 * - initials (文字头像)
 * - pixel-art (像素风)
 * - identicon (几何图案)
 */

// 可用的头像风格
const AVATAR_STYLES = {
  CARTOON: "adventurer" as const,
  ROBOT: "bottts" as const,
  INITIALS: "initials" as const,
  PIXEL: "pixel-art" as const,
  GEOMETRIC: "identicon" as const,
  LORELEI: "lorelei" as const,
  NOTIONISTS: "notionists-neutral" as const,
  MICAH: "micah" as const,
} as const;

interface AvatarOptions {
  seed: string;
  style?: (typeof AVATAR_STYLES)[keyof typeof AVATAR_STYLES];
  size?: number;
  backgroundColor?: string;
}

/**
 * 生成头像URL
 * @param {Object} options - 配置选项
 * @param {string} options.seed - 生成种子(可以是用户ID、邮箱等唯一标识)
 * @param {string} options.style - 头像风格,参考 AVATAR_STYLES
 * @param {number} options.size - 图片尺寸,默认 128px
 * @param {string} options.backgroundColor - 背景色(hex格式,可选)
 * @returns {string} 生成的头像URL
 */
function generateAvatar(
  {
    seed,
    style = AVATAR_STYLES.CARTOON,
    size = 64,
    backgroundColor = "#fff",
  }: AvatarOptions = {} as AvatarOptions
) {
  if (!seed) {
    throw new Error("seed 参数是必须的");
  }

  // 验证风格是否有效
  if (!Object.values(AVATAR_STYLES).includes(style)) {
    throw new Error(`无效的头像风格: ${style}`);
  }

  // 构建基础URL
  let url = `https://api.dicebear.com/7.x/${style}/svg`;

  // 构建查询参数
  const params = new URLSearchParams({
    seed,
    size: size.toString(),
  });

  // 添加可选的背景色
  if (backgroundColor) {
    // 确保背景色格式正确(移除#号)
    const bgColor = backgroundColor.replace("#", "");
    params.append("backgroundColor", bgColor);
  }

  // 返回完整的URL
  return `${url}?${params.toString()}`;
}

/**
 * 生成随机种子
 * @returns {string} 随机字符串
 */
function generateRandomSeed() {
  return Math.random().toString(36).substring(2);
}

// 导出工具函数和常量
export { generateAvatar, generateRandomSeed, AVATAR_STYLES };
