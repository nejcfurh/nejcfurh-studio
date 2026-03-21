declare module '*.png' {
  import type { ImageSourcePropType } from 'react-native';
  const content: ImageSourcePropType;
  export default content;
}

declare module '*.ttf' {
  const content: number;
  export default content;
}
