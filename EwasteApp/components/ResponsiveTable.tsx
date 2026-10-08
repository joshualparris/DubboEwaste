import { Children, cloneElement, isValidElement, type HTMLAttributes, type ReactElement, type ReactNode } from "react";

type NodeProps = { children?: ReactNode; colSpan?: number; className?: string; scope?: string; role?: string };

function text(node: ReactNode): string {
  return Children.toArray(node).map((child) => {
    if (typeof child === "string" || typeof child === "number") return String(child);
    return isValidElement<NodeProps>(child) ? text(child.props.children) : "";
  }).join("");
}

/** One semantic table, rendered as labelled records on phones. Forms and selection keep their identity. */
export function ResponsiveTable({ children, className = "", mobile = "cards", ...props }: HTMLAttributes<HTMLTableElement> & { mobile?: "cards" | "scroll" }) {
  const sections = Children.toArray(children);
  const head = sections.find((node) => isValidElement(node) && node.type === "thead") as ReactElement<NodeProps> | undefined;
  const headerRow = head && Children.toArray(head.props.children).find((node) => isValidElement(node) && node.type === "tr") as ReactElement<NodeProps> | undefined;
  const labels = headerRow ? Children.toArray(headerRow.props.children).map((node) => text(node)) : [];
  // Financial totals, row-header summaries and spanning headers retain their tabular relationships.
  const hasFooter = sections.some((node) => isValidElement(node) && node.type === "tfoot");
  const cards = mobile === "cards" && labels.length > 0 && !hasFooter;

  return <table {...props} role="table" className={`${cards ? "record-table" : "scroll-table"} ${className}`}>
    {sections.map((section) => {
      if (!isValidElement<NodeProps>(section)) return section;
      if (section.type === "thead") return cloneElement(section, { role: "rowgroup" });
      if (!cards || section.type !== "tbody") return section;
      return cloneElement(section, { role: "rowgroup", children: Children.map(section.props.children, (row) => {
        if (!isValidElement<NodeProps>(row) || row.type !== "tr") return row;
        return cloneElement(row, { role: "row", children: Children.map(row.props.children, (cell, index) => {
          if (!isValidElement<NodeProps>(cell) || cell.type !== "td") return cell;
          const spanning = (cell.props.colSpan ?? 1) > 1;
          const label = labels[index] || (index === 0 ? "Select" : "Actions");
          return cloneElement(cell, {
            role: "cell",
            className: `${cell.props.className || ""} ${spanning ? "record-cell-full" : ""}`,
            children: <>{!spanning && <span className="record-field-label" aria-hidden="true">{label}</span>}<div className="record-field-value">{cell.props.children}</div></>,
          });
        }) });
      }) });
    })}
  </table>;
}
