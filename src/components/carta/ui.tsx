import { useEffect, useRef, useState, type ReactNode } from "react";

/** Fades content in when it scrolls into view. */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} data-visible={visible} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

/** Thin crescent moon — used as a small recurring seal. */
export function MoonSeal({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M15.5 3.5a8.5 8.5 0 1 0 5 15 7 7 0 0 1-5-15z" fill="currentColor" />
    </svg>
  );
}

export function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 text-primary/60" aria-hidden="true">
      <span className="h-px w-12 bg-border" />
      <span className="text-[10px] tracking-[0.5em]">● ◐ ○ ◑ ●</span>
      <span className="h-px w-12 bg-border" />
    </div>
  );
}

/** Photo slot: shows the photo if provided (and loads), otherwise an elegant empty frame. */
export function PhotoSlot({ src, caption, className = "" }: { src: string; caption?: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const show = src && !failed;
  return (
    <figure className={`paper p-3 pb-4 ${className}`}>
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        {show ? (
          <img src={src} alt={caption ?? ""} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-3 flex flex-col items-center justify-center gap-2 border border-dashed border-border text-center text-muted-foreground">
            <MoonSeal className="h-5 w-5 opacity-50" />
            <span className="eyebrow">espaço para uma foto</span>
          </div>
        )}
      </div>
      {caption && <figcaption className="mt-3 text-center font-display text-base italic text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}
