import { Helmet } from 'react-helmet-async'

import ClubViews from '@/components/ClubViews'
import SubmissionGameContainer from '@/components/submission/SubmissionGameContainer'

export default function Submission() {
  return (
    <>
      <Helmet>
        <title>Quiz | Find Football Player</title>
      </Helmet>
      <ClubViews />
      {/* <SubmissionGameContainer /> */}
    </>
  )
}
