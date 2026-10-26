// Hosts the Next image optimizer is allowed to fetch (see remotePatterns in
// next.config). A pasted external URL from some other host is rendered with the
// `unoptimized` flag instead, so the optimizer never fetches arbitrary hosts on
// our behalf — that would turn /_next/image into an SSRF proxy.
const OPTIMIZED_HOSTS = [/\.public\.blob\.vercel-storage\.com$/, /(^|\.)picsum\.photos$/];

export function shouldOptimize(src: string | null | undefined): boolean {
  if (!src) return false;
  try {
    const host = new URL(src).hostname;
    return OPTIMIZED_HOSTS.some((re) => re.test(host));
  } catch {
    return false;
  }
}
