import { Helmet } from 'react-helmet-async'
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  absoluteUrl,
  documentTitle,
} from '../config'

type PageMetaProps = {
  title?: string
  description?: string
  path?: string
  noIndex?: boolean
  ogImage?: string
}

export default function PageMeta({
  title,
  description = SITE_DESCRIPTION,
  path = '/',
  noIndex = false,
  ogImage,
}: PageMetaProps) {
  const fullTitle = documentTitle(title)
  const url = absoluteUrl(path)
  const robots = noIndex ? 'noindex, nofollow' : 'index, follow'

  return (
    <Helmet>
      <html lang='ko' />
      <title>{fullTitle}</title>
      <meta name='description' content={description} />
      <meta name='robots' content={robots} />
      <link rel='canonical' href={url} />

      <meta property='og:type' content='website' />
      <meta property='og:site_name' content={SITE_NAME} />
      <meta property='og:title' content={fullTitle} />
      <meta property='og:description' content={description} />
      <meta property='og:url' content={url} />
      {ogImage && <meta property='og:image' content={ogImage} />}

      <meta
        name='twitter:card'
        content={ogImage ? 'summary_large_image' : 'summary'}
      />
      <meta name='twitter:title' content={fullTitle} />
      <meta name='twitter:description' content={description} />
    </Helmet>
  )
}
