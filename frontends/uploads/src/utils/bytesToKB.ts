/**
 * Converts bytes to kilobytes (KB) with a specified number of decimal places.
 *
 * @param bytes - The size in bytes.
 * @param decimals - The number of decimal places to include in the result (default is 2).
 * @returns The size in KB, formatted as a string with the specified decimals.
 */
export const bytesToKB = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 KB';
  const kilobytes = bytes / 1024;
  return `${kilobytes.toFixed(decimals)} KB`;
};
