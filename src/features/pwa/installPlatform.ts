export type InstallPlatform = 'iphone' | 'ipad' | 'other';
export function detectInstallPlatform(
  userAgent: string,
  maxTouchPoints: number,
): InstallPlatform {
  if (/iPhone|iPod/i.test(userAgent)) return 'iphone';
  if (
    /iPad/i.test(userAgent) ||
    (/Macintosh/i.test(userAgent) && maxTouchPoints > 1)
  )
    return 'ipad';
  return 'other';
}
