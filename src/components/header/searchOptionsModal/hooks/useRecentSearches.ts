// useRecentSearches.ts
import { useState, useEffect } from "react";

export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const searches = JSON.parse(
      localStorage.getItem("videoshare-recent-searches") || "[]"
    );
    setRecentSearches(searches);
  }, []);

  return recentSearches;
};
