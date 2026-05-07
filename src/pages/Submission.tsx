import { useEffect, useMemo, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { Helmet } from 'react-helmet-async'
import styled from 'styled-components'

import SearchForm from '@/components/SearchForm'
import { quizState, inputState, leagueInfoState } from '@/state'
import useQuizGenerator from '@/hooks/useQuizGenerator'
import ClubViews from '@/components/ClubViews'
import HintBox from '../components/HintBox'
import useFetchingPlayersDataInLeague from '../hooks/useFetchingPlayersDataInLeague'
import useFetchingPlayersIdInLeague from '@/hooks/useFetchingPlayersIdInLeague'

import type { IHint } from '../types'
import type { IFirebasePlayer } from '@/api/api.types'

// TODO: quiz 변수를 해당 페이지말고 다른 곳에서 쓰는지 확인 후,
// local or 전역 상태 변경 및 유지 확인
const Container = styled.div`
  position: relative;
  width: 500px;
  min-height: 300px;
  border-radius: 15px;
  margin-bottom: 50px;
  ${({ theme }) => theme.media.mobile} {
    width: 100%;
  }
`
const FormContainer = styled.div`
  position: relative;
  width: 100%;
  height: 280px;
  text-align: center;
  margin: 0 auto;
  margin-bottom: 30px;
  background-color: white;
  border-radius: 15px;
  padding-bottom: 15px;

  z-index: 10;
  ${({ theme }) => theme.media.mobile} {
    width: 100%;
    border-radius: 0;
  }
`
const Photo = styled.img<{ $isCorrect: boolean }>`
  width: 160px;
  height: 180px;
  border-radius: 20px;
  margin-top: 10px;
  margin-bottom: 20px;
  ${props => (props.$isCorrect ? null : 'filter: blur(13px)')};

  animation: showing-image 0.3s ease-out forwards;
  @keyframes showing-image {
    0% {
      opacity: 0;
      transform: translateX(20px); /* 약간 작게 시작해서 위로 올라옴 */
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
`
const AlertButton = styled.button`
  position: absolute;
  padding: 8px 12px;
  top: 5%;
  right: 5%;
  z-index: 10;

  font-size: 15px;
  background: rgb(65, 105, 225, 0.62);
  box-shadow: 0px 2px #4169e1;
  color: white;
  padding: 0.5em 0.8em;
  display: flex;
  align-items: center;
  border: none;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
`
const LoadingWrapper = styled.div`
  width: 100%;
  height: 280px;
  text-align: center;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: skyblue;
  border-radius: 15px;
  padding: 10px 20px;
  & span {
    font-size: 2rem;
    font-weight: bold;
    line-height: 3rem;
    color: white;
  }
`

const Submission = () => {
  const leagueInfo = useRecoilValue(leagueInfoState)

  // squad: 선수 자동 완성 목록을 필터링할 전체 선수 목록
  const {
    isPending: isIdsPending,
    error: idsError,
    playersId,
  } = useFetchingPlayersIdInLeague({
    leagueId: leagueInfo.id,
  })

  const {
    isPending: isPlayersPending,
    error: playersError,
    playersInLeague: squad,
  } = useFetchingPlayersDataInLeague({
    leagueId: leagueInfo.id,
    playerIds: playersId,
  })

  const isPending = isIdsPending || isPlayersPending
  const error = idsError || playersError

  if (error)
    return (
      <SubmissionLoader
        message='선수 데이터를 불러오는 데 실패했습니다.
      잠시 후 다시 시도해주세요.'
      />
    )

  return (
    <>
      <Helmet>
        <title>Quiz | Find Football Player</title>
      </Helmet>
      <ClubViews />
      <Container>
        <ContentsComponent isPending={isPending} squad={squad ?? []} />
      </Container>
    </>
  )
}

export default Submission

function ContentsComponent({
  isPending,
  squad,
}: {
  isPending: boolean
  squad: IFirebasePlayer[]
}) {
  const [hintArr, setHintArr] = useState<IHint[]>([])
  const [isCorrect, setIsCorrect] = useState<boolean>(false)
  const setValue = useSetRecoilState(inputState)
  const quiz = useRecoilValue(quizState)
  const { generateQuiz } = useQuizGenerator(squad)

  const resetQuiz = () => {
    setIsCorrect(false)
    setHintArr([])
    setValue('')
  }

  useEffect(() => {
    if (squad?.length === 0) return
    generateQuiz()
  }, [squad])

  return (
    <>
      <FormContainer>
        {isPending ? (
          <div style={{ width: 160, height: 180, background: 'gray' }}>
            skeleton ui
          </div>
        ) : (
          <Photo
            key={quiz?.photo}
            draggable={false}
            src={quiz?.photo}
            alt={`${quiz?.name}`}
            $isCorrect={isCorrect}
            width='160'
            height='180'
          />
        )}

        <SearchForm
          squad={squad}
          quiz={quiz}
          disabled={isCorrect}
          setIsCorrect={setIsCorrect}
          setHintArr={setHintArr}
        />
      </FormContainer>
      {hintArr && hintArr?.length > 0 && <HintBox hintArr={hintArr} />}
      <ChangeButton resetQuiz={resetQuiz} generateQuiz={generateQuiz} />
    </>
  )
}

function ChangeButton({
  resetQuiz,
  generateQuiz,
}: {
  resetQuiz: () => void
  generateQuiz: () => void
}) {
  const handleClick = () => {
    generateQuiz()
    resetQuiz()
  }
  return (
    <AlertButton onClick={handleClick}>
      <span>문제 변경</span>
    </AlertButton>
  )
}

function SubmissionLoader({ message }: { message: string }) {
  return (
    <LoadingWrapper>
      <span>{message}</span>
    </LoadingWrapper>
  )
}
