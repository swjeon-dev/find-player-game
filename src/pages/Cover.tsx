import { useState } from 'react'
import styled from 'styled-components'

import LeagueSelectModal from '@/components/LeagueSelectModal'

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

export const Cover = () => {
  const [onModal, setOnModal] = useState(false)
  const handleClick = () => {
    setOnModal(true)
  }

  return (
    <Button onClick={handleClick}>
      <Span>Game Start</Span>
      {onModal && <LeagueSelectModal closeModal={() => setOnModal(false)} />}
    </Button>
  )
}
