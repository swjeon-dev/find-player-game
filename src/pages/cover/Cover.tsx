import { Section } from '@/widget/cover'
import { Helmet } from 'react-helmet-async'

const Cover = () => {
  return (
    <>
      <Helmet>
        <title>Find Football Player</title>
        <meta name='description' content='Home | Find Football Player' />
        <meta name='keywords' content='Find Football Player' />
        <meta name='author' content='up1' />
        <meta name='robots' content='index, follow' />
        <meta name='googlebot' content='index, follow' />
      </Helmet>

      <Section />
    </>
  )
}

export default Cover
