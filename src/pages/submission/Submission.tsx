import { ClubViews } from '@/widget'
import { SubmissionGameContainer } from '@/features/submission'
import { PageMeta, ROUTER_PATH } from '@/shared'

function Submission() {
  return (
    <>
      <PageMeta
        title={'Quiz'}
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
