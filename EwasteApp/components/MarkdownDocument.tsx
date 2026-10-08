import { ResponsiveTable } from "@/components/ResponsiveTable";
import Link from "next/link";
import { SOURCE_BASENAME_TO_SLUG, sourceUrl } from "@/lib/operational-documents";

function inline(text: string) {
  const tokens = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return tokens.map((token, index) => {
    const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, target] = link;
      if (/^https?:\/\//.test(target)) return <a key={index} href={target} target="_blank" rel="noreferrer">{label}</a>;
      const base = target.split("/").pop() || target;
      const slug = SOURCE_BASENAME_TO_SLUG.get(base);
      if (slug) return <Link key={index} href={`/documents/${slug}`}>{label}</Link>;
      const cleaned = target.replace(/^\.\//, "").replace(/^\.\.\//, "");
      return <a key={index} href={sourceUrl(cleaned.startsWith("docs/") || cleaned.startsWith("templates/") ? cleaned : `docs/${cleaned}`)} target="_blank" rel="noreferrer">{label}</a>;
    }
    if (token.startsWith("**") && token.endsWith("**")) return <strong key={index}>{token.slice(2, -2)}</strong>;
    if (token.startsWith("`") && token.endsWith("`")) return <code key={index}>{token.slice(1, -1)}</code>;
    return <span key={index}>{token}</span>;
  });
}

function cells(line: string) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((value) => value.trim());
}

export function MarkdownDocument({ body }: { body: string }) {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const out: React.ReactNode[] = [];

  for (let i = 0; i < lines.length;) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++]);
      i += 1;
      out.push(<pre className="doc-code" key={out.length}><code data-language={language || undefined}>{code.join("\n")}</code></pre>);
      continue;
    }

    if (line.trim().startsWith("|") && i + 1 < lines.length && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1])) {
      const header = cells(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(cells(lines[i++]));
      out.push(
        <div className="table-wrap doc-table" key={out.length}>
          <ResponsiveTable mobile="scroll">
            <thead><tr>{header.map((value, index) => <th key={index}>{inline(value)}</th>)}</tr></thead>
            <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((value, cellIndex) => <td key={cellIndex}>{inline(value)}</td>)}</tr>)}</tbody>
          </ResponsiveTable>
        </div>,
      );
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = Math.min(6, heading[1].length + 1);
      const content = inline(heading[2]);
      if (level === 2) out.push(<h2 key={out.length}>{content}</h2>);
      else if (level === 3) out.push(<h3 key={out.length}>{content}</h3>);
      else if (level === 4) out.push(<h4 key={out.length}>{content}</h4>);
      else if (level === 5) out.push(<h5 key={out.length}>{content}</h5>);
      else out.push(<h6 key={out.length}>{content}</h6>);
      i += 1;
      continue;
    }

    const task = line.match(/^\s*- \[([ xX])\]\s+(.+)$/);
    if (task) {
      const tasks: Array<{ checked: boolean; text: string }> = [];
      while (i < lines.length) {
        const match = lines[i].match(/^\s*- \[([ xX])\]\s+(.+)$/);
        if (!match) break;
        tasks.push({ checked: match[1].toLowerCase() === "x", text: match[2] });
        i += 1;
      }
      out.push(<div className="doc-checklist" key={out.length}>{tasks.map((item, index) => <label className="doc-task" key={index}><input type="checkbox" checked={item.checked} readOnly /><span>{inline(item.text)}</span></label>)}</div>);
      continue;
    }

    if (/^\s*-\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*-\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*-\s+/, ""));
      out.push(<ul key={out.length}>{items.map((item, index) => <li key={index}>{inline(item)}</li>)}</ul>);
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*\d+\.\s+/, ""));
      out.push(<ol key={out.length}>{items.map((item, index) => <li key={index}>{inline(item)}</li>)}</ol>);
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) quote.push(lines[i++].replace(/^\s*>\s?/, ""));
      out.push(<blockquote key={out.length}>{quote.map((item, index) => <p key={index}>{inline(item)}</p>)}</blockquote>);
      continue;
    }

    if (/^\s*---+\s*$/.test(line)) {
      out.push(<hr key={out.length} />);
      i += 1;
      continue;
    }

    if (!line.trim()) {
      i += 1;
      continue;
    }

    const paragraph: string[] = [line.trim()];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,6})\s+/.test(lines[i]) &&
      !lines[i].startsWith("```") &&
      !/^\s*- \[[ xX]\]\s+/.test(lines[i]) &&
      !/^\s*-\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^\s*>\s?/.test(lines[i]) &&
      !/^\s*---+\s*$/.test(lines[i]) &&
      !lines[i].trim().startsWith("|")
    ) {
      paragraph.push(lines[i].trim());
      i += 1;
    }
    out.push(<p key={out.length}>{inline(paragraph.join(" "))}</p>);
  }

  return <article className="document-markdown">{out}</article>;
}
