export const textIntoWords = (text: string) => {
  return text.split(/\s+/).filter(word => word.length > 0);
};
