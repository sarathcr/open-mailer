export const extractPlaceholders = (template: string) => {
  const placeholderRegex = /{{#?[^{}]+}}/g;
  const matches = template.match(placeholderRegex);
  return [...new Set(matches)].map((match) => match.trim());
};
