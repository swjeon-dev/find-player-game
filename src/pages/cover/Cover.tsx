import { SITE_DESCRIPTION } from '@/shared'
import PageMeta from '@/shared/ui/PageMeta'
import { Section } from '@/widget/cover'

const Cover = () => {
  return (
    <>
      <PageMeta description={SITE_DESCRIPTION} path='/' />
      <Section />
    </>
  )
}

export default Cover
