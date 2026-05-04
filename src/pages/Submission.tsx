import { useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { Helmet } from 'react-helmet-async'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

import SearchForm from '@/components/SearchForm'
import { inputState, leagueInfoState, quizState } from '@/atoms/quizState'
import useQuizGenerator from '@/hooks/useQuizGenerator'
import ClubViews from '@/components/ClubViews'
import HintBox from '../components/HintBox'
import useFetchingPlayersDataInLeague from '../hooks/useFetchingPlayersDataInLeague'
import routerPath from '../constant/routerPath'

import type { IHint } from '../types'

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
  & span {
    font-size: 2rem;
    font-weight: bold;
    line-height: 3rem;
    color: white;
    word-break: keep-all;
  }
`

const Submission = () => {
  const navigate = useNavigate()
  const quiz = useRecoilValue(quizState)
  const setValue = useSetRecoilState(inputState)
  const leagueInfo = useRecoilValue(leagueInfoState)
  // squad: 선수 자동 완성 목록을 필터링할 전체 선수 목록
  const {
    isPending,
    error,
    playersInLeague: squad,
  } = useFetchingPlayersDataInLeague(leagueInfo.id, {
    enabled: quiz !== null,
  })

  const [hintArr, setHintArr] = useState<IHint[]>([])
  const [isCorrect, setIsCorrect] = useState<boolean>(false)

  useEffect(() => {
    if (quiz === null) {
      navigate(routerPath.HOME, { replace: true })
      alert('문제가 준비되지 않았습니다.')
    }
  }, [quiz])

  if (quiz === null || isPending)
    return <SubmissionLoader message='Loading...' />

  if (error)
    return (
      <SubmissionLoader message='데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.' />
    )

  const resetQuiz = () => {
    setIsCorrect(false)
    setHintArr([])
    setValue('')
  }

  return (
    <>
      <Helmet>
        <title>Quiz | Find Football Player</title>
      </Helmet>
      <ClubViews />
      <Container>
        <FormContainer>
          <Photo
            key={quiz?.photo}
            draggable={false}
            src={quiz?.photo}
            alt={`${quiz?.name}`}
            $isCorrect={isCorrect}
          />
          <SearchForm
            squad={squad}
            quiz={quiz}
            disabled={isCorrect}
            setIsCorrect={setIsCorrect}
            setHintArr={setHintArr}
          />
        </FormContainer>
        {hintArr && hintArr?.length > 0 && <HintBox hintArr={hintArr} />}
        <ChangeButton resetQuiz={resetQuiz} />
      </Container>
    </>
  )
}

export default Submission

function ChangeButton({ resetQuiz }: { resetQuiz: () => void }) {
  const { generateRandomPlayer } = useQuizGenerator()
  const handleClick = () => {
    generateRandomPlayer()
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
    <Container>
      <LoadingWrapper>
        <span>{message}</span>
      </LoadingWrapper>
    </Container>
  )
}
