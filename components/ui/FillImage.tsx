import Image from "next/image";

type FillImageProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
};

export function FillImage({ src, alt, sizes, priority = false }: FillImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      fetchPriority={priority ? "high" : undefined}
    />
  );
}
