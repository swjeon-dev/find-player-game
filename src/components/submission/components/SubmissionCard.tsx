import SearchForm from '@/components/SearchForm'
import HintBox from '@/components/HintBox'
import type { IFirebasePlayer } from '@/api/api.types'

import ChangeButton from './ChangeButton'
import useSubmissionGame from '../hooks/useSubmissionGame'
import { FormContainer, Photo, PhotoSkeleton } from '../styles'

interface SubmissionCardProps {
  isPending: boolean
  squad: IFirebasePlayer[]
}

const SubmissionCard = ({ isPending, squad }: SubmissionCardProps) => {
  const { quiz, hintArr, isCorrect, setIsCorrect, setHintArr, changeQuiz } =
    useSubmissionGame(squad)

  const isDisabled = isPending || isCorrect

  return (
    <>
      <FormContainer $isPending={isPending}>
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

        {quiz ? (
          <SearchForm
            squad={squad}
            quiz={quiz}
            disabled={isDisabled}
            setIsCorrect={setIsCorrect}
            setHintArr={setHintArr}
          />
        ) : null}
      </FormContainer>

      {hintArr.length > 0 ? <HintBox hintArr={hintArr} /> : null}
      <ChangeButton onClick={changeQuiz} />
    </>
  )
}

export default SubmissionCard
