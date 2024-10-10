export const replaceTxt = (text:string):string=>{
  // 定义不能用于文件名的字符
  const invalidChars = /[\/:*?"<>|]/g;
  // 将这些非法字符替换为空字符串或其他符号，如下划线
  return text.replace(invalidChars, '_');
}