import { Outlet } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import styled from 'styled-components'

import { Header, useHeaderObserver } from '@/widget/header'

const Container = styled.div<{ $height: number }>`
  display: flex;
  justify-content: center;
  max-width: 1280px;
  gap: 15px;
  margin: 0 auto;
  padding: 10px 20px;
  height: calc(100vh - ${({ $height }) => $height}px);
  ${({ theme }) => theme.media.tablet} {
    width: 100%;
  }
`

function RootLayout() {
  const { height: headerHeight, headerRef } = useHeaderObserver()

  return (
    <>
      <Helmet>
        <title>Find Football Player</title>
      </Helmet>
      <header ref={headerRef}>
        <Header />
      </header>
      <main id='main-content'>
        <Container $height={headerHeight}>
          <Outlet />
        </Container>
      </main>
    </>
  )
}
export default RootLayout
