export const replaceTxt = (text: string): string => {
  // 定义不能用于文件名的字符（包括 #，同时考虑了 Windows 和 Unix 文件名规则）
  const invalidChars = /[\/:*?"<>|\\#\x00-\x1F]/g;  // 这里增加了 # 字符
  // 将这些非法字符替换为下划线
  return text.replace(invalidChars, '_').replace(/^_+|_+$/g, '');  // 防止首尾为下划线
};
