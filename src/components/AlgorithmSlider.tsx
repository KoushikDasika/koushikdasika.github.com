import type { ReactNode } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface Slide {
  title: string;
  content: string;
}

interface AlgorithmSliderProps {
  slides: Slide[];
}

export default function AlgorithmSlider({ slides }: AlgorithmSliderProps) {
  return (
    <div className="my-8 rounded-xl border border-border bg-card overflow-hidden">
      <Tabs defaultValue="0">
        <div className="border-b border-border bg-muted/50 px-4 pt-4">
          <TabsList className="h-auto flex-wrap gap-1 bg-transparent p-0">
            {slides.map((slide, i) => (
              <TabsTrigger
                key={i}
                value={String(i)}
                className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-t-md rounded-b-none border border-transparent data-[state=active]:border-border data-[state=active]:border-b-card mb-[-1px]"
              >
                <span className="text-muted-foreground mr-1 data-[state=active]:text-primary-foreground">
                  {i + 1}.
                </span>
                {slide.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {slides.map((slide, i) => (
          <TabsContent key={i} value={String(i)} className="p-6 mt-0 prose dark:prose-invert max-w-none">
            <SlideContent content={slide.content} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function SlideContent({ content }: { content: string }) {
  const lines = content.trim().split('\n');
  const elements: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-xl font-bold mt-0 mb-4 text-foreground">{line.slice(3)}</h2>);
      i++;
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-lg font-semibold mt-4 mb-3 text-foreground">{line.slice(4)}</h3>);
      i++;
    } else if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      elements.push(<p key={i} className="font-semibold mb-3 text-foreground">{line.slice(2, -2)}</p>);
      i++;
    } else if (line.startsWith('> ')) {
      const blockLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        blockLines.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <blockquote key={i} className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-4">
          {blockLines.map((bl, bi) => <p key={bi} className="mb-1">{bl || <br />}</p>)}
        </blockquote>
      );
    } else if (line.startsWith('| ')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('| ')) {
        tableLines.push(lines[i]);
        i++;
      }
      const headers = tableLines[0].split('|').filter(Boolean).map(h => h.trim());
      const rows = tableLines.slice(2).map(row => row.split('|').filter(Boolean).map(c => c.trim()));
      elements.push(
        <div key={i} className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted">
                {headers.map((h, hi) => (
                  <th key={hi} className="border border-border px-3 py-2 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="even:bg-muted/30">
                  {row.map((cell, ci) => (
                    <td key={ci} className="border border-border px-3 py-2">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (line.startsWith('- ') || line.match(/^\d+\. /)) {
      const listLines: string[] = [];
      const isOrdered = line.match(/^\d+\. /);
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].match(/^\d+\. /))) {
        listLines.push(isOrdered ? lines[i].replace(/^\d+\. /, '') : lines[i].slice(2));
        i++;
      }
      const ListTag = isOrdered ? 'ol' : 'ul';
      elements.push(
        <ListTag key={i} className={`mb-4 space-y-1 pl-5 ${isOrdered ? 'list-decimal' : 'list-disc'} text-foreground/90`}>
          {listLines.map((item, li) => <li key={li}>{item}</li>)}
        </ListTag>
      );
    } else if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      elements.push(
        <pre key={i} className="bg-muted rounded-lg p-4 overflow-x-auto mb-4 text-sm font-mono">
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
    } else if (line.trim() === '' || line.trim() === '---') {
      i++;
    } else {
      // Inline formatting: bold and code
      const formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
        .replace(/_(.*?)_/g, '<em>$1</em>');
      elements.push(
        <p
          key={i}
          className="mb-3 text-foreground/90 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
      i++;
    }
  }

  return <div>{elements}</div>;
}
