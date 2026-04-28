interface DiagramFigureProps {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  caption?: string;
}

export default function DiagramFigure({ lightSrc, darkSrc, alt, caption }: DiagramFigureProps) {
  return (
    <figure className="my-8 rounded-xl border border-border bg-card p-4 sm:p-6 flex flex-col items-center overflow-x-auto">
      <img src={lightSrc} alt={alt} className="block dark:hidden max-w-full h-auto rounded-lg" />
      <img src={darkSrc} alt={alt} className="hidden dark:block max-w-full h-auto rounded-lg" />
      {caption && (
        <figcaption className="mt-3 text-sm text-muted-foreground text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
