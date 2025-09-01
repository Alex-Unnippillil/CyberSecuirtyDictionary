import Image, { type ImageProps } from "next/image";

export type MdxImageProps = ImageProps;

export default function MdxImage(props: MdxImageProps) {
  return <Image {...props} alt={props.alt} />;
}
