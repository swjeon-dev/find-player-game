import { useCallback, useRef } from 'react'

import useFetchingTeamSquadData from '../../hooks/useFetchingTeamPlayersData'
import { Loader, Name, PlayerList, PlayerRow } from './style'
import { useModalPosition, useSelectPlayer } from './hook'

interface IClubSquadModalProps {
  id: number
  parentRef: React.RefObject<HTMLImageElement>
  offModal: () => void
}

// 클럽의 등록된 선수를 보여주는 Modal
const ClubSquadModal = ({ id, parentRef, offModal }: IClubSquadModalProps) => {
  const {
    isPending,
    error,
    playerInTeam: players,
  } = useFetchingTeamSquadData(id)
  const listRef = useRef<HTMLUListElement>(null)

  const isToMove = useModalPosition(listRef, parentRef, [players, isPending])

  const handleClick = useSelectPlayer(offModal)

  return (
    <PlayerList ref={listRef} $isToMove={isToMove}>
      {isPending ? (
        <Message message='Loading...' />
      ) : error || !players?.length ? (
        <Message message='현재 선수 목록을 가져올 수 없습니다' />
      ) : (
        players.map(player => (
          <Player
            key={player.id}
            name={player.name}
            handleClick={() => handleClick(player.name)}
          />
        ))
      )}
    </PlayerList>
  )
}

export default ClubSquadModal

function Message({ message }: { message: string; isLoading?: boolean }) {
  return (
    <Loader>
      <span>{message}</span>
    </Loader>
  )
}

function Player({
  name,
  handleClick,
}: {
  name: string
  handleClick: () => void
}) {
  return (
    <PlayerRow onClick={handleClick}>
      <Name>{name}</Name>
    </PlayerRow>
  )
}
