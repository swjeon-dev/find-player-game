import { Helmet } from 'react-helmet-async'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import routerPath from '@/constant/routerPath'

const Page = styled.section`
  width: 100%;
  min-height: calc(100vh - 300px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 0 56px;
`

const Card = styled.div`
  width: min(100%, 720px);
  border-radius: 20px;
  padding: 36px 28px;
  background-color: #023047;
  border: 1px solid rgba(255, 255, 255, 0.12);

  ${({ theme }) => theme.media.mobile} {
    padding: 28px 20px;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
`

const Title = styled.h1`
  margin: 0;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.2;
  font-weight: 800;
`

const Description = styled.p`
  margin: 0;
  max-width: 520px;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.6;
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 4px;
`

const ActionLink = styled(Link)<{ $variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 170px;
  padding: 14px 18px;
  border-radius: 14px;
  font-weight: 700;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease,
    background-color 0.2s ease;
  color: ${({ $variant }) => ($variant === 'secondary' ? 'white' : '#001d3d')};
  background-color: ${({ $variant }) =>
    $variant === 'secondary' ? 'rgba(255, 255, 255, 0.12)' : '#f9c74f'};
  border: 1px solid
    ${({ $variant }) =>
      $variant === 'secondary' ? 'rgba(255, 255, 255, 0.18)' : 'transparent'};

  &:hover {
    transform: translateY(-2px);
    opacity: 0.96;
  }

  ${({ theme }) => theme.media.mobile} {
    width: 100%;
  }
`

export default function NotFound() {
  const { pathname } = useLocation()

  return (
    <Page>
      <Helmet>
        <title>404 | Find Football Player</title>
        <meta
          name='description'
          content='요청하신 페이지를 찾을 수 없습니다. Find Football Player 홈으로 돌아가 다시 시작해보세요.'
        />
      </Helmet>

      <Card>
        <Content>
          <Title>페이지를 찾을 수 없습니다.</Title>
          <Description>
            잘못된 페이지 접근입니다. 홈으로 이동해주세요.
          </Description>
          <Actions>
            <ActionLink to={routerPath.HOME}>홈으로 이동</ActionLink>
          </Actions>
        </Content>
      </Card>
    </Page>
  )
}
