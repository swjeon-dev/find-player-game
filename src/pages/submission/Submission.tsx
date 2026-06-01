import { Helmet } from 'react-helmet-async'

import SubmissionGameContainer from '@/components/submission/SubmissionGameContainer'
import ClubViews from '@/entities/club/ui/ClubViews'

function Submission() {
  return (
    <>
      <Helmet>
        <title>Quiz | Find Football Player</title>
        <meta name='description' content='Quiz | Find Football Player' />
        <meta name='keywords' content='Quiz, Find Football Player' />
        <meta name='author' content='up1' />
        <meta name='robots' content='index, follow' />
        <meta name='googlebot' content='index, follow' />
      </Helmet>
      <ClubViews />
      <SubmissionGameContainer />
    </>
  )
}

export default Submission
