import styled from 'styled-components'

import LeagueSelectModal from '@/components/LeagueSelectModal'
import { Helmet } from 'react-helmet-async'

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
  return (
    <>
      <Helmet>
        <title>Find Football Player</title>
        <meta name='description' content='Home | Find Football Player' />
        <meta name='keywords' content='Find Football Player' />
        <meta name='author' content='up1' />
        <meta name='robots' content='index, follow' />
        <meta name='googlebot' content='index, follow' />
      </Helmet>
      <LeagueSelectModal>
        {({ openModal }) => (
          <Button type='button' onClick={openModal}>
            <Span>Game Start</Span>
          </Button>
        )}
      </LeagueSelectModal>
    </>
  )
}
