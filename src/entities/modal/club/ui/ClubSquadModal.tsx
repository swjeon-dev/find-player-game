import { memo, useRef } from 'react'

import { useFetchingTeamPlayersData } from '@/hooks/data/useFetchingTeamPlayers'
import { Loader, Name, PlayerList, PlayerRow } from './style'
import { useModalPosition, useSelectPlayer } from '../model'

function Message({ message }: { message: string; isLoading?: boolean }) {
  return (
    <Loader>
      <span>{message}</span>
    </Loader>
  )
}
const Player = memo(function Player({
  name,
  handleClick,
}: {
  name: string
  handleClick: (name: string) => void
}) {
  return (
    <PlayerRow onClick={() => handleClick(name)}>
      <Name>{name}</Name>
    </PlayerRow>
  )
})

interface IClubSquadModalProps {
  teamId: number
  parentRef: React.RefObject<HTMLImageElement>
  offModal: () => void
}

const ClubSquadModal = ({
  teamId,
  parentRef,
  offModal,
}: IClubSquadModalProps) => {
  const {
    isPending,
    error,
    playerInTeam: players,
  } = useFetchingTeamPlayersData(teamId)
  const listRef = useRef<HTMLUListElement>(null)

  const isTransfer = useModalPosition({
    listRef,
    parentRef,
    triggerKey: teamId,
  })

  const handleClick = useSelectPlayer(offModal)

  return (
    <>
      <PlayerList ref={listRef} $isTransfer={isTransfer}>
        {isPending ? (
          <Message message='Loading...' />
        ) : error || !players?.length ? (
          <Message message='현재 선수 목록을 가져올 수 없습니다' />
        ) : (
          players.map(player => (
            <Player
              key={player.id}
              name={player.name}
              handleClick={handleClick}
            />
          ))
        )}
      </PlayerList>
    </>
  )
}

export default ClubSquadModal
