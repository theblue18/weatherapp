/**
 * Converts an ISO date string to a human-readable datetime format.
 * @param {string} isoDate - The ISO date string to format.
 * @returns {string} - The formatted datetime string.
 */
export function formatToDateTime(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleString(); // Customize the format if needed
  }
  