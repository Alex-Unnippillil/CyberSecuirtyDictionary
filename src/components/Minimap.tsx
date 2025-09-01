import React, { useEffect, useState } from 'react';

interface MinimapProps {
  /**
   * CSS selector used to collect sections of the document. Each element must
   * have an `id` so that the minimap can link to it.
   *
   * @default 'section'
   */
  sectionSelector?: string;
}

/**
 * Minimap renders a small overview of the document's sections. Each section is
 * represented by a block scaled according to its height relative to the entire
 * page. The block corresponding to the section currently in view is
 * highlighted. Clicking a block scrolls to the associated section.
 */
const Minimap: React.FC<MinimapProps> = ({ sectionSelector = 'section' }) => {
  const [sections, setSections] = useState<HTMLElement[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Collect sections on mount.
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(sectionSelector)
    ).filter((el) => el.id);
    setSections(elements);

    // Observer to determine which section is in the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        // Trigger as soon as the top of the section enters the viewport
        rootMargin: '0px 0px -80% 0px',
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sectionSelector]);

  const scrollHeight = document.body.scrollHeight;

  const handleClick = (el: HTMLElement) => {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className="minimap"
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        width: '12px',
        height: '100%',
        background: 'rgba(0,0,0,0.05)',
      }}
    >
      {sections.map((el) => {
        const top = (el.offsetTop / scrollHeight) * 100;
        const height = (el.offsetHeight / scrollHeight) * 100;
        const isActive = el.id === activeId;
        return (
          <div
            key={el.id}
            onClick={() => handleClick(el)}
            style={{
              position: 'absolute',
              left: 0,
              width: '100%',
              cursor: 'pointer',
              top: `${top}%`,
              height: `${height}%`,
              background: isActive
                ? 'rgba(33,150,243,0.8)'
                : 'rgba(33,150,243,0.3)',
            }}
          />
        );
      })}
    </div>
  );
};

export default Minimap;
