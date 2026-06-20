import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Vignette image (WebP, /public/assets) auto-dimensionnée via `fill`.
 * Le conteneur porte la taille (className). Repli sur un emoji si pas d'image.
 */
export function Thumb({
  name,
  alt,
  emoji,
  className,
  imgClassName,
  sizes = "(max-width: 768px) 50vw, 400px",
  priority,
}: {
  /** nom de fichier sans extension (ex. "plat-burger") ou undefined → fallback emoji */
  name?: string;
  alt: string;
  emoji?: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-navy-900/5", className)}>
      {name ? (
        <Image src={`/assets/${name}.webp`} alt={alt} fill sizes={sizes} priority={priority} className={cn("object-cover", imgClassName)} />
      ) : (
        emoji && <span className="absolute inset-0 flex items-center justify-center text-4xl">{emoji}</span>
      )}
    </div>
  );
}
