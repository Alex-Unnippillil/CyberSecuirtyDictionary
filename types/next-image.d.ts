declare module 'next/image' {
  import * as React from 'react';

  export type ImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

  const Image: React.ComponentType<ImageProps>;
  export default Image;
}
