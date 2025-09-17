"use client";
import React from "react";
import * as s from "./Accordion.css";

export interface AccordionItem {
  id: string;
  header: React.ReactNode;
  content: React.ReactNode;
  defaultOpen?: boolean;
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items: AccordionItem[];
  multiple?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  multiple = false,
  className,
  ...rest
}) => {
  const [openIds, setOpenIds] = React.useState<Set<string>>(
    () => new Set(items.filter((i) => i.defaultOpen).map((i) => i.id))
  );

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      const isOpen = next.has(id);
      if (multiple) {
        if (isOpen) next.delete(id);
        else next.add(id);
      } else {
        next.clear();
        if (!isOpen) next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={[s.root, className].filter(Boolean).join(" ")} {...rest}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <div key={item.id} className={s.item}>
            <button
              className={s.header}
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
            >
              <span>{item.header}</span>
              <span
                className={[s.chevron, isOpen && s.chevronOpen]
                  .filter(Boolean)
                  .join(" ")}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
            {isOpen && <div className={s.panel}>{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
