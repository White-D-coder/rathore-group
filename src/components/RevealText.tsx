import { Children, cloneElement, isValidElement, type HTMLAttributes, type ReactElement, type ReactNode } from "react";

function plainText(node: ReactNode): string {
  return Children.toArray(node).map(child => typeof child === "string" || typeof child === "number"
    ? String(child) : isValidElement<{ children?: ReactNode }>(child)
      ? child.type === "br" ? " " : plainText(child.props.children) : "").join("");
}

/** React owns every word wrapper, including text that changes when tabs are selected. */
export default function RevealText({ as: Tag = "h2", children, className = "", ...props }: HTMLAttributes<HTMLElement> & { as?: "h1" | "h2" | "h3" | "h4"; children: ReactNode }) {
  let index = 0;
  function words(node: ReactNode): ReactNode {
    return Children.map(node, child => {
      if (typeof child === "string" || typeof child === "number")
        return String(child).split(/(\s+)/).map((word, i) => !word.trim() ? word : (
          <span className="reveal-word" aria-hidden="true" key={i}>
            <span style={{ transitionDelay: `${Math.min(index++, 16) * 32}ms` }}>{word}</span>
          </span>
        ));
      if (isValidElement<{ children?: ReactNode }>(child) && child.props.children)
        return cloneElement(child as ReactElement<{ children?: ReactNode }>, {}, words(child.props.children));
      return child;
    });
  }
  return <Tag {...props} className={`text-reveal ${className}`} aria-label={plainText(children).replace(/\s+/g, " ").trim()}>{words(children)}</Tag>;
}
