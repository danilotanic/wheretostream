import { useEffect, useRef } from "react";

export default function useAutofocus() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 10);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const allowedKeys = [
        "F5",
        "F12",
        "Tab",
        "Control",
        "Meta",
        "Alt",
        "Escape",
      ];

      if (allowedKeys.includes(event.key)) {
        return; // Skip refocusing for these keys
      }

      // Refocus the input for other keys
      if (inputRef.current) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 10);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return inputRef;
}
