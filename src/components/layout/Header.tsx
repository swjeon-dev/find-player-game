import useBreakpoint from '@/hooks/ui/useBreakpoint'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 5px auto;
`
const SubContainer = styled.div`
  display: flex;
  width: 100%;
  height: 30%;
  background-color: #f9c74f;
  font-size: 16px;
`

const Text = styled.span`
  margin: auto;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  padding: 5px 10px;
  font-weight: bold;
  color: red;
  & span {
    color: black;
    font-weight: bold;
  }
`
const ReferenceLink = styled.a`
  color: red;
  font-weight: bold;
`

const HomeLink = styled(Link)<{ $isTablet: boolean }>`
  color: white;
  font-weight: bold;
  padding: 5px 10px;
  text-align: center;
  font-size: ${({ $isTablet }) => (!$isTablet ? '40px' : '25px')};
`

const Header = () => {
  const { isAtMost } = useBreakpoint()
  const isTablet = isAtMost('tablet')

  return (
    <Container>
      <HomeLink to='/' $isTablet={isTablet}>
        Find Football Player
      </HomeLink>
      <SubContainer>
        <Text>
          <span>original: </span>
          <ReferenceLink
            href='https://playfootball.games/who-are-ya/big-4/'
            target='_blank'
          >
            https://playfootball.games/who-are-ya/big-4/
          </ReferenceLink>
        </Text>
      </SubContainer>
    </Container>
  )
}

export default Header
