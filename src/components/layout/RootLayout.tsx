import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import styled from 'styled-components'

import { GlobalStyle } from '@/styles/GlobalStyle'
import { queryClient } from '@/queryClient'
import { fetchPlayersDataInLeague } from '@/services/clientService'
import { REACT_QUERY_OPTIONS } from '@/api'
import Header from '../Header'
import { DEFAULT_API_PARAMS } from 'shared/params'

const Container = styled.div`
  display: flex;
  justify-content: center;
  max-width: 1280px;
  gap: 15px;
  margin: 0 auto;
  padding: 0 20px;
  ${({ theme }) => theme.media.tablet} {
    width: 100%;
  }
`

function RootLayout() {
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: [DEFAULT_API_PARAMS.league, 'league', 'players'],
      queryFn: () => fetchPlayersDataInLeague(DEFAULT_API_PARAMS.league),
      ...REACT_QUERY_OPTIONS,
    })
  }, [])

  return (
    <>
      <Helmet>
        <title>Find Football Player</title>
      </Helmet>
      <Header />
      <GlobalStyle />
      <Container>
        <Outlet />
      </Container>
    </>
  )
}
export default RootLayout
