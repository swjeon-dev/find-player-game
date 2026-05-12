import { useRecoilValue } from 'recoil'

import SearchForm from '@/components/SearchForm'
import HintBox from '@/components/HintBox'
import { quizState } from '@/state'
import ChangeButton from './ChangeButton'
import useSubmissionGame from '../hooks/useSubmissionGame'
import { FormContainer, Photo, PhotoSkeleton } from './SubmissionCard.styles'

interface SubmissionCardProps {
  isPending: boolean
  generateQuiz: () => void
}

const SubmissionCard = ({ isPending, generateQuiz }: SubmissionCardProps) => {
  const quiz = useRecoilValue(quizState)
  const { hintArr, isCorrect, setIsCorrect, setHintArr, changeQuiz } =
    useSubmissionGame({ generateQuiz })

  const isDisabled = isPending || isCorrect

  return (
    <>
      <FormContainer $isPending={isPending} role='submission-card'>
        {isPending ? (
          <PhotoSkeleton />
        ) : (
          <Photo
            key={quiz?.photo}
            draggable={false}
            src={quiz?.photo}
            alt={quiz?.name ?? 'quiz-player'}
            $isCorrect={isCorrect}
            width='160'
            height='180'
          />
        )}

        <SearchForm
          quiz={quiz}
          disabled={isDisabled}
          setIsCorrect={setIsCorrect}
          setHintArr={setHintArr}
        />
      </FormContainer>

      <HintBox hintArr={hintArr} />
      <ChangeButton onClick={changeQuiz} />
    </>
  )
}

export default SubmissionCard
