const steps = [
  { label: "Observe Problem", letter: "A", active: false },
  { label: "Research", letter: "B", active: false },
  { label: "Form Hypothesis", letter: "C", active: false },
  { label: "Plan & Design", letter: "D", active: false },
  { label: "Execute / Code", letter: "E", active: true },
  { label: "Collect Results", letter: "F", active: false },
  { label: "Iterate", letter: "G", active: false },
];

export default function ScientificMethodDiagram() {
  return (
    <figure className="my-8 rounded-xl border border-border bg-card p-4 sm:p-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 flex-wrap">
        {steps.map((step, i) => (
          <div key={step.letter} className="flex items-center flex-shrink-0">
            <div
              className={`
                flex flex-col items-center justify-center
                rounded-lg border px-3 py-2 sm:px-4 sm:py-3
                min-w-[100px] sm:min-w-[120px] text-center
                transition-colors
                ${step.active
                  ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm shadow-primary/20"
                  : "border-border bg-background text-foreground/80"
                }
              `}
            >
              <span className="text-xs text-muted-foreground font-mono mb-0.5">{step.letter}</span>
              <span className="text-xs sm:text-sm leading-tight">{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <svg className="hidden sm:block w-5 h-4 text-muted-foreground flex-shrink-0 mx-0.5" viewBox="0 0 20 16" fill="none">
                <path d="M4 8h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {i < steps.length - 1 && (
              <svg className="block sm:hidden w-4 h-5 text-muted-foreground flex-shrink-0" viewBox="0 0 16 20" fill="none">
                <path d="M8 4v12m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
            <path d="M15 5l-5 5-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 10 10)" />
          </svg>
          <span>G iterates back to B</span>
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
            <path d="M15 5l-5 5-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 10 10)" />
          </svg>
        </div>
      </div>
      <figcaption className="mt-3 text-sm text-muted-foreground text-center italic">
        Engineering follows the scientific method. Coding is just step E.
      </figcaption>
    </figure>
  );
}
