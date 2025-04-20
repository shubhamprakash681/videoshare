import { useState, useEffect } from "react";

export const useKeyboardNavigation = (
  totalItems: number,
  onEnter: (selectedIndex: number) => void
) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((curr) => (curr + 1) % totalItems);
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((curr) => (curr - 1 + totalItems) % totalItems);
    } else if (e.key === "Enter") {
      e.preventDefault();

      onEnter(selectedIndex);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [totalItems, selectedIndex, handleKeyDown]);

  return { selectedIndex };
};
