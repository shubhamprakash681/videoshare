import sanitizeHtml from "sanitize-html";

const useSanitizedHTML = () => {
  const sanitizeHTMLContent: (
    htmlContent: string,
    options?: sanitizeHtml.IOptions
  ) => string = (htmlContent, options) => {
    const sanitizedContent = sanitizeHtml(htmlContent, {
      allowedTags: options?.allowedTags || sanitizeHtml.defaults.allowedTags,
      allowedAttributes:
        options?.allowedAttributes || sanitizeHtml.defaults.allowedAttributes,
    });

    return sanitizedContent;
  };

  return { sanitizeHTMLContent };
};

export default useSanitizedHTML;
