import { createPortal } from 'react-dom'
import { useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useSetRecoilState } from 'recoil'

import routerPath from '@/constant/routerPath'

import emblemImage from '/emblem/pl.webp'
import { leagueInfoState } from '@/state'
import { queryClient } from '@/lib/queryClient'
import {
  fetchPlayersDataInLeagueByIds,
  fetchPlayerIdsInLeague,
  fetchTeamIdsInLeague,
} from '@/services/clientService'
import { queryKeysMain } from '@/lib/queryKeys'

const Dialog = styled.dialog`
  width: 80%;
  max-width: 500px;
  height: 280px;
  background-color: #6b7280;
  padding: 0;
  border: none;
  border-radius: 12px;
  &::backdrop {
    background: rgba(0, 0, 0, 0.7);
  }
`
const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
`
const Span = styled.span`
  color: rgb(255, 255, 255);
  font-weight: bold;
`
const Title = styled(Span)`
  font-size: 1.5rem;
`
const BoxContainer = styled.div``
const Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
  &:hover {
    border: 1px solid white;
    border-radius: 15px;
    cursor: pointer;
  }
`
const Emblem = styled.img`
  width: 70px;
  height: 70px;
`

// temp
interface leagueListProps {
  name: string
  id: number
  // season: number
  // webp image
  emblemImage: string
}

const leagueList: leagueListProps[] = [
  {
    name: 'pl',
    id: 39,
    // season: 2024, // 26년 기준 최신
    emblemImage,
  },
]

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

export default function LeagueSelectModal({
  closeModal,
}: {
  closeModal: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const navigate = useNavigate()
  const setLeagueInfo = useSetRecoilState(leagueInfoState)

  const setLeagueRange = (league: leagueListProps) => {
    setLeagueInfo({ id: league.id })
    navigate(routerPath.SUBMISSION)
  }

  const prefetchTeams = (leagueId: leagueListProps['id']) => {
    // 리그 팀 id 조회
    const teamsIds: number[] | undefined = queryClient.getQueryData(
      queryKeysMain.teams.idsByLeaguePersisted(leagueId),
    )

    // 프리페치: 리그 팀 id 조회
    if (!teamsIds?.length) {
      return queryClient.prefetchQuery({
        queryKey: queryKeysMain.teams.idsByLeaguePersisted(leagueId),
        queryFn: () => fetchTeamIdsInLeague(leagueId),
      })
    }
  }

  const prefetchPlayers = (leagueId: leagueListProps['id']) => {
    // league id 기준 선수 id 조회
    const playersId: number[] | undefined = queryClient.getQueryData(
      queryKeysMain.players.idsByLeaguePersisted(leagueId),
    )

    if (!playersId?.length) {
      // 프리페치: league id 기준 선수 id 조회
      return queryClient.prefetchQuery({
        queryKey: queryKeysMain.players.idsByLeaguePersisted(leagueId),
        queryFn: () => fetchPlayerIdsInLeague(leagueId),
      })
    }

    // 프리페치: 선수 id 기준 선수 데이터 조회 > 리그 선수 데이터 조회
    return queryClient.prefetchQuery({
      queryKey: queryKeysMain.players.byLeague(leagueId),
      queryFn: () => fetchPlayersDataInLeagueByIds(playersId),
    })
  }

  const prefetchingLeagueData = useMemo(
    () =>
      debounce((leagueId: leagueListProps['id']) => {
        prefetchTeams(leagueId)
        prefetchPlayers(leagueId)
      }, 200),
    [],
  )

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal()
      dialogRef.current?.scrollTo({ top: 0 })
    }
  }, [])

  return createPortal(
    <Dialog
      ref={dialogRef}
      onMouseDown={e => {
        if (e.target === e.currentTarget) {
          closeModal()
        }
      }}
      onClose={closeModal}
    >
      <Container onClick={e => e.stopPropagation()}>
        <Title>Select League you want</Title>
        <BoxContainer>
          {leagueList.map(league => (
            <Box
              key={`league-${league.name}`}
              onClick={() => setLeagueRange(league)}
              onMouseEnter={() => prefetchingLeagueData(league.id)}
              aria-label={`${league.name} 리그 선택 버튼`}
            >
              <Emblem
                src={league.emblemImage}
                width='70'
                height='70'
                alt={`${league.name} emblem image`}
              />
              <Span>PL</Span>
            </Box>
          ))}
        </BoxContainer>
      </Container>
    </Dialog>,
    document.getElementById('modal-root') as HTMLElement,
  )
}
