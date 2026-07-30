import Image from "next/image";

// Small product thumbnail used in the cart line items and suggestions.
export function ProductThumb({
  src,
  alt,
  size = 52,
}: {
  src?: string | null;
  alt: string;
  size?: number;
}) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-lg bg-sand/30"
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover" />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-[9px] text-themeText2 font-heb">
          תמונה
        </span>
      )}
    </div>
  );
}
