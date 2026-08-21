import { useRecoilValue } from 'recoil'

import { ClubViews } from '@/widget'
import { SubmissionGameContainer } from '@/features/submission'
import { PageMeta, ROUTER_PATH } from '@/shared'
import { leagueInfoState } from '@/entities/league'

function Submission() {
  const league = useRecoilValue(leagueInfoState)

  return (
    <>
      <PageMeta
        title={league.id ? `${league.id} 퀴즈` : 'Quiz'}
        description='리그를 선택한 뒤 블러 사진을 보고 선수 이름을 맞히는 퀴즈입니다.'
        path={ROUTER_PATH.SUBMISSION}
        noIndex
      />
      <ClubViews />
      <SubmissionGameContainer />
    </>
  )
}

export default Submission
