import styled from 'styled-components'

import LeagueSelectModal from '@/components/cover/LeagueSelectModal'
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

const ButtonLabel = styled.span`
  font-size: 50px;
  font-weight: bold;
  color: white;
  margin: auto;
`

const CoverSection = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
`

const SectionHeading = styled.h2`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

export const Cover = () => {
  return (
    <CoverSection aria-labelledby='cover-game-heading'>
      <Helmet>
        <title>Find Football Player</title>
        <meta name='description' content='Home | Find Football Player' />
        <meta name='keywords' content='Find Football Player' />
        <meta name='author' content='up1' />
        <meta name='robots' content='index, follow' />
        <meta name='googlebot' content='index, follow' />
      </Helmet>
      <SectionHeading id='cover-game-heading'>Game Start</SectionHeading>
      <LeagueSelectModal>
        {({ openModal }) => (
          <Button type='button' onClick={openModal} aria-labelledby='cover-game-heading'>
            <ButtonLabel>Game Start</ButtonLabel>
          </Button>
        )}
      </LeagueSelectModal>
    </CoverSection>
  )
}
