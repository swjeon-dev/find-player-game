import { useEffect } from 'react'

import useQuizGenerator from '@/hooks/useQuizGenerator'
import SubmissionCard from './components/SubmissionCard'
import { SubmissionLoader } from './components/SubmissionLoader'
import { Container } from './styles'
import ProfileComp from '../Profiler'

export default function SubmissionGameContainer() {
  const { generateQuiz, isGeneratingQuiz, quizError } = useQuizGenerator()

  useEffect(() => {
    generateQuiz()
  }, [])

  const retryFetching = () => {
    generateQuiz()
  }

  if (quizError) {
    return (
      <SubmissionLoader
        message='선수 데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.'
        onRetry={retryFetching}
      />
    )
  }

  return (
    <Container>
      {/* <ProfileComp id='SubmissionGameContainer'> */}
      <SubmissionCard
        isPending={isGeneratingQuiz}
        generateQuiz={generateQuiz}
      />
      {/* </ProfileComp> */}
    </Container>
  )
}
