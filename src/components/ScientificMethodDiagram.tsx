interface Step {
  lines: string[];
  letter: string;
  id: string;
  highlight?: boolean;
}

const CX = 250;
const CY = 215;
const OUTER_R = 130;
const INNER_R = 80;
const BUMP = 10;
const LABEL_R = 174;
const GAP = 3.5;
const SEGMENT = (360 - 7 * GAP) / 7;

const steps: Step[] = [
  { lines: ["Identify", "Problem"], letter: "A", id: "a" },
  { lines: ["Research"], letter: "B", id: "b" },
  { lines: ["Form", "Hypothesis"], letter: "C", id: "c" },
  { lines: ["Plan &", "Design"], letter: "D", id: "d" },
  { lines: ["Execute /", "Code"], letter: "E", id: "e", highlight: true },
  { lines: ["Deploy &", "Measure"], letter: "F", id: "f" },
  { lines: ["Iterate"], letter: "G", id: "g" },
];

function polar(r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function segmentPath(index: number, highlight?: boolean) {
  const oR = highlight ? OUTER_R + BUMP : OUTER_R;
  const start = index * (SEGMENT + GAP);
  const end = start + SEGMENT;
  const a = polar(oR, start);
  const b = polar(oR, end);
  const c = polar(INNER_R, end);
  const d = polar(INNER_R, start);
  return `M${a.x},${a.y}A${oR},${oR} 0 0 1 ${b.x},${b.y}L${c.x},${c.y}A${INNER_R},${INNER_R} 0 0 0 ${d.x},${d.y}Z`;
}

function midAngle(index: number) {
  return index * (SEGMENT + GAP) + SEGMENT / 2;
}

function getTextAnchor(deg: number) {
  const a = ((deg % 360) + 360) % 360;
  if (a >= 340 || a < 20) return "middle";
  if (a >= 160 && a < 200) return "middle";
  return a >= 20 && a < 160 ? "start" : "end";
}

function getLabelOffset(deg: number) {
  const a = ((deg % 360) + 360) % 360;
  if (a >= 340 || a < 20) return { dx: 0, dy: -8 };
  if (a >= 160 && a < 200) return { dx: 0, dy: 16 };
  if (a >= 20 && a < 160) return { dx: 10, dy: 4 };
  return { dx: -10, dy: 4 };
}

export default function ScientificMethodDiagram() {
  const arrowR = INNER_R - 16;
  const arrowFrom = polar(arrowR, midAngle(6) - 10);
  const arrowTo = polar(arrowR, midAngle(1) + 10);

  return (
    <figure className="my-8 rounded-xl border border-border bg-card p-4 sm:p-6 overflow-hidden">
      <svg
        viewBox="0 0 500 440"
        className="w-full max-w-lg mx-auto"
        role="img"
        aria-label="Scientific method wheel: 7 steps in a circle with Execute / Code (step E) highlighted as roughly 20% of engineering work."
      >
        <style>{`
          .smd-a{fill:#3D7A8A}.dark .smd-a{fill:#5C9DAD}
          .smd-b{fill:#4A6491}.dark .smd-b{fill:#6B8BC0}
          .smd-c{fill:#CC6347}.dark .smd-c{fill:#E07A5F}
          .smd-d{fill:#4B8E6F}.dark .smd-d{fill:#6BB89A}
          .smd-e{fill:#7C3AED}.dark .smd-e{fill:#A78BFA}
          .smd-f{fill:#B88A2E}.dark .smd-f{fill:#D4A84E}
          .smd-g{fill:#3A6B68}.dark .smd-g{fill:#5A9B95}
        `}</style>

        <defs>
          <filter id="smd-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker id="smd-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-muted-foreground" opacity="0.5" />
          </marker>
        </defs>

        {/* Ring segments */}
        {steps.map((step, i) => (
          <path
            key={step.letter}
            d={segmentPath(i, step.highlight)}
            className={`smd-${step.id}`}
            filter={step.highlight ? "url(#smd-glow)" : undefined}
          />
        ))}

        {/* Letters on segments */}
        {steps.map((step, i) => {
          const angle = midAngle(i);
          const r = (OUTER_R + INNER_R) / 2 + (step.highlight ? BUMP / 2 : 0);
          const pos = polar(r, angle);
          return (
            <text
              key={`letter-${step.letter}`}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="white"
              fontSize="15"
              fontWeight="700"
              fontFamily="system-ui, sans-serif"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
            >
              {step.letter}
            </text>
          );
        })}

        {/* Labels outside ring */}
        {steps.map((step, i) => {
          const angle = midAngle(i);
          const r = LABEL_R + (step.highlight ? BUMP : 0);
          const pos = polar(r, angle);
          const anchor = getTextAnchor(angle);
          const off = getLabelOffset(angle);
          const vertAdj = step.lines.length > 1 ? -7 : 0;
          return (
            <text
              key={`label-${step.letter}`}
              textAnchor={anchor}
              className="fill-foreground"
              fontSize="13"
              fontWeight={step.highlight ? "700" : "500"}
              fontFamily="system-ui, sans-serif"
            >
              {step.lines.map((line, li) => (
                <tspan
                  key={li}
                  x={pos.x + off.dx}
                  y={pos.y + off.dy + vertAdj}
                  dy={li === 0 ? "0" : "1.15em"}
                >
                  {line}
                </tspan>
              ))}
            </text>
          );
        })}

        {/* Center text */}
        <text textAnchor="middle" fontFamily="system-ui, sans-serif">
          <tspan x={CX} y={CY - 14} fontSize="11" className="fill-muted-foreground">
            The
          </tspan>
          <tspan x={CX} y={CY + 4} fontSize="16" fontWeight="700" className="fill-foreground">
            Scientific
          </tspan>
          <tspan x={CX} y={CY + 22} fontSize="16" fontWeight="700" className="fill-foreground">
            Method
          </tspan>
          <tspan x={CX} y={CY + 38} fontSize="10" fontStyle="italic" className="fill-muted-foreground">
            in Engineering
          </tspan>
        </text>

        {/* Iteration arrow (G → B through top) */}
        <path
          d={`M${arrowFrom.x},${arrowFrom.y}A${arrowR},${arrowR} 0 0 1 ${arrowTo.x},${arrowTo.y}`}
          fill="none"
          className="stroke-muted-foreground"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          markerEnd="url(#smd-arrow)"
          opacity="0.5"
        />
        <text
          textAnchor="middle"
          fontSize="9"
          className="fill-muted-foreground"
          fontStyle="italic"
          fontFamily="system-ui, sans-serif"
        >
          <tspan x={CX} y={CY - INNER_R - 25}>
            G iterates back to B
          </tspan>
        </text>
      </svg>

      <figcaption className="mt-3 text-sm text-muted-foreground text-center italic">
        Engineering follows the scientific method. Coding is just step E.
      </figcaption>
    </figure>
  );
}
