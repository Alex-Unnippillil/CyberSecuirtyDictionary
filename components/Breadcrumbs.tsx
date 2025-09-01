import React from "react";
import { LayoutGroup, motion } from "framer-motion";

export interface Crumb {
  href: string;
  label: string;
}

export interface BreadcrumbsProps {
  items: Crumb[];
  current?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, current }) => {
  return (
    <LayoutGroup id="breadcrumbs">
      <nav aria-label="Breadcrumbs">
        <ol style={{ display: "flex", listStyle: "none", margin: 0, padding: 0 }}>
          {items.map((item) => {
            const isActive = current === item.href || current === item.label;
            return (
              <li
                key={item.href}
                style={{ position: "relative", padding: "0 0.5rem" }}
              >
                <a href={item.href}>{item.label}</a>
                {isActive && (
                  <motion.span
                    layoutId="breadcrumb-indicator"
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: -2,
                      height: 2,
                      background: "currentColor",
                      borderRadius: 2,
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </LayoutGroup>
  );
};

export default Breadcrumbs;
