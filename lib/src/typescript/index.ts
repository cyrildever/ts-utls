/**
 * Compute the equivalent of Java's hashCode for the passed string
 * 
 * @param s - The string to use
 * @returns the hashCode
 */
export const hashCode = (s: string): number =>
  Array.from(s).reduce((h: number, c: string) => Math.imul(31, h) + c.charCodeAt(0) | 0, 0)
