/** True when next/image may resize `src`: local /public paths and Supabase
 *  Storage (the hosts allowlisted in next.config.ts). Any other pasted URL must
 *  render with `unoptimized`, or next/image throws on the unknown host. */
export const canOptimize = (src: string) =>
  src.startsWith("/") || /^https:\/\/[^/]+\.supabase\.co\//.test(src);
