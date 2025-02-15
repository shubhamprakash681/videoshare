import useSanitizedHTML from "@/hooks/useSanitizedHTML";
import sanitizeHtml from "sanitize-html";

// function for removing extra charcters that left after sanitizing description highlights
const removeIncompleteTags = (sanitizedHtml: string) => {
  const allTags = sanitizeHtml.defaults.allowedTags;
  const allLtTags = allTags.map((tg) => `&lt;${tg}`).concat("&lt;");
  const allGtTags = allTags.map((tg) => `${tg}&gt;`).concat("&gt;");

  allLtTags.forEach((tg) => (sanitizedHtml = sanitizedHtml.replace(tg, "")));
  allGtTags.forEach((tg) => (sanitizedHtml = sanitizedHtml.replace(tg, "")));

  return sanitizedHtml;
};

interface HighlightedSearchProps {
  highlights: {
    score: number;
    path: "description" | "title";
    texts: {
      value: string;
      type: "text" | "hit";
    }[];
  };
}
const HighlightedSearch: React.FC<HighlightedSearchProps> = ({
  highlights,
}) => {
  const { sanitizeHTMLContent } = useSanitizedHTML();

  if (highlights?.path === "description") {
    return (
      <>
        {highlights?.texts.map((segment, index) => (
          <span
            key={`search-${highlights?.path}-${segment.value}-${index}`}
            className={`${
              segment.type === "hit" ? "bg-green-300 dark:bg-green-800" : ""
            } `}
          >
            {removeIncompleteTags(
              sanitizeHTMLContent(segment.value, { allowedTags: [] })
            )}
          </span>
        ))}
      </>
    );
  }

  return (
    <>
      {highlights?.texts.map((segment, index) => (
        <span
          key={`search-${highlights?.path}-${segment.value}-${index}`}
          className={`${
            segment.type === "hit" ? "bg-green-300 dark:bg-green-800" : ""
          } `}
        >
          {segment.value}
        </span>
      ))}
    </>
  );
};

export default HighlightedSearch;
