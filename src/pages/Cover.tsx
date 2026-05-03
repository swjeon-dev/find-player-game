import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'

import { quizState } from '@/atoms/quizState'
import Modal from '@/components/Modal'

const Button = styled.button`
  border: 1px solid white;
  width: 500px;
  height: 280px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: red;
  border-radius: 15px;
  &:hover {
    cursor: pointer;
  }
  z-index: 1;
  ${({ theme }) => theme.media.mobile} {
    width: 100%;
  }
`
const Span = styled.span`
  font-size: 50px;
  font-weight: bold;
  color: white;
  margin: auto;
`

// TODO: 임시 스쿼드 -> 전체 팀 스쿼드 변경
export const Cover = () => {
  const quiz = useRecoilValue(quizState)

  // to after modal
  // const { generateRandomPlayer } = useQuizGenerator()

  // useEffect(() => {
  //   if (!quiz) {
  //     generateRandomPlayer()
  //   }
  // }, [generateRandomPlayer, quiz])

  const [onModal, setOnModal] = useState(false)
  const handleClick = () => {
    setOnModal(true)
  }

  return (
    <Button onClick={handleClick}>
      <Span>Game Start</Span>
      {onModal && <Modal closeModal={() => setOnModal(false)} />}
    </Button>
  )
}
