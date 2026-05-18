import { createPortal } from 'react-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useSetRecoilState } from 'recoil'

import routerPath from '@/constant/routerPath'
import { useDebouncedCallback } from '@/hooks/ui/useDebouncedCallback'
import { queryClient } from '@/lib/queryClient'
import {
  fetchPlayerIdsInLeague,
  fetchTeamIdsInLeague,
} from '@/services/clientService'
import { queryKeysMain } from '@/lib/queryKeys'
import { leagueInfoState } from '@/state'

import emblemImage from '/emblem/pl.webp'

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

interface LeagueSelectModalProps {
  children: (handlers: { openModal: () => void }) => React.ReactNode
}

export default function LeagueSelectModal({
  children,
}: LeagueSelectModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const navigate = useNavigate()
  const setLeagueInfo = useSetRecoilState(leagueInfoState)

  const closeModal = useCallback(() => {
    dialogRef.current?.close()
    setIsOpen(false)
  }, [])

  const setLeagueRange = (league: leagueListProps) => {
    setLeagueInfo({ id: league.id })
    navigate(routerPath.SUBMISSION)
  }

  const prefetchLeagueData = useCallback((leagueId: leagueListProps['id']) => {
    const teamsIds = queryClient.getQueryData<number[]>(
      queryKeysMain.teams.idsByLeaguePersisted(leagueId),
    )
    if (!teamsIds?.length) {
      void queryClient.prefetchQuery({
        queryKey: queryKeysMain.teams.idsByLeaguePersisted(leagueId),
        queryFn: () => fetchTeamIdsInLeague(leagueId),
      })
    }

    const playersId = queryClient.getQueryData<number[]>(
      queryKeysMain.players.idsByLeaguePersisted(leagueId),
    )
    if (!playersId?.length) {
      void queryClient.prefetchQuery({
        queryKey: queryKeysMain.players.idsByLeaguePersisted(leagueId),
        queryFn: () => fetchPlayerIdsInLeague(leagueId),
      })
    }
  }, [])

  const prefetchingLeagueData = useDebouncedCallback(prefetchLeagueData, 200)

  useEffect(() => {
    if (!isOpen) return

    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal()
      dialogRef.current.scrollTo({ top: 0 })
    }
  }, [isOpen])

  return (
    <>
      {children({ openModal: () => setIsOpen(true) })}
      {isOpen &&
        createPortal(
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
        )}
    </>
  )
}
