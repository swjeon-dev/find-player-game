export const SITE_NAME = 'Find Football Player'
export const SITE_DESCRIPTION =
  '블러 처리된 프리미어리그 선수 사진을 보고 이름을 맞히는 축구 퀴즈입니다.'
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL ??
  'https://swjeon-dev.github.io/find-player-game'
).replace(/\/$/, '')

export function absoluteUrl(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const base = import.meta.env.BASE_URL.replace(/\/$/, '') || ''
  return `${SITE_URL}${base}${normalized === '/' ? '/' : normalized}`
}

export function documentTitle(pageTitle?: string) {
  return pageTitle ? `${pageTitle} | ${SITE_NAME}` : SITE_NAME
}
