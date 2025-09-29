"use client";
import React from "react";
import * as s from "./Accordion.css";
import Typography from "../Typography/Typography";

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
              aria-controls={`accordion-panel-${item.id}`}
            >
              <Typography as="h2" font="Instrument Sans" weight={400}>
                {item.header}
              </Typography>
            </button>
            {isOpen && (
              <div
                id={`accordion-panel-${item.id}`}
                className={s.panel}
                role="region"
              >
                <Typography as="h6" font="Instrument Sans" weight={400}>
                  {item.content}
                </Typography>
              </div>
            )}
            <button
              className={s.icon}
              onClick={() => toggle(item.id)}
              aria-label={isOpen ? "Collapse section" : "Expand section"}
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${item.id}`}
            >
              {isOpen ? (
                // Minus icon
                <svg
                  width="28"
                  height="1"
                  viewBox="0 0 34 1"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line y1="0.5" x2="34" y2="0.5" stroke="black" />
                </svg>
              ) : (
                // Plus icon
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line y1="16.5" x2="34" y2="16.5" stroke="black" />
                  <line
                    x1="17.5"
                    y1="2.18557e-08"
                    x2="17.5"
                    y2="34"
                    stroke="black"
                  />
                </svg>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
