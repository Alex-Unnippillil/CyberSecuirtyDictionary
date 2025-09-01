import React from 'react';

export interface ComboboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * ID of the listbox element associated with this combobox. The listbox
   * element should contain options with `role="option"`.
   */
  listboxId: string;
}

/**
 * Accessible combobox input. This component assigns the correct `role`
 * attribute, manages the `aria-expanded` state, and allows keyboard
 * navigation to the associated listbox.
 */
const Combobox = React.forwardRef<HTMLInputElement, ComboboxProps>(
  ({ listboxId, onKeyDown, onFocus, onBlur, ...props }, forwardedRef) => {
    const [expanded, setExpanded] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Expose the internal input element to parent refs.
    React.useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement);

    const moveFocusToListbox = (first: boolean) => {
      const listbox = document.getElementById(listboxId);
      if (!listbox) return;
      const options = listbox.querySelectorAll<HTMLElement>('[role="option"]');
      if (options.length === 0) return;
      const index = first ? 0 : options.length - 1;
      options[index].focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setExpanded(true);
        e.preventDefault();
        moveFocusToListbox(e.key === 'ArrowDown');
      } else if (e.key === 'Escape') {
        setExpanded(false);
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setExpanded(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Collapse the listbox if focus moves outside the combobox or listbox.
      window.setTimeout(() => {
        const listbox = document.getElementById(listboxId);
        const active = document.activeElement;
        if (
          active !== inputRef.current &&
          listbox &&
          !listbox.contains(active)
        ) {
          setExpanded(false);
        }
      }, 0);
      onBlur?.(e);
    };

    return (
      <input
        {...props}
        ref={inputRef}
        role="combobox"
        aria-expanded={expanded}
        aria-controls={listboxId}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    );
  }
);

export default Combobox;
