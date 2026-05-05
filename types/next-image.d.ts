import type { ComponentType, ImgHTMLAttributes } from "react";

/**
 * Local compatibility shim for non-Next.js tooling.
 * Required because this repository type-checks React components importing
 * `next/image`, while `next` is not installed in this package.
 */
declare module "next/image" {
  export type ImageProps = ImgHTMLAttributes<HTMLImageElement>;
  const Image: ComponentType<ImageProps>;
  export default Image;
}
