import { memo, useRef } from 'react'

import { useFetchingTeamPlayersData } from '@/hooks/data/useFetchingTeamPlayers'
import { Loader, Name, PlayerList, PlayerRow } from './style'
import { useModalPosition, useSelectPlayer } from './hooks/useClubSquadModal'

interface IClubSquadModalProps {
  teamId: number
  parentRef: React.RefObject<HTMLImageElement>
  offModal: () => void
}

// 클럽의 등록된 선수를 보여주는 Modal
// TODO: 선수 목록 조회 실패 시 처리 + 선수 목록을 전체 말고 일부만 조금씩 출력
const ClubSquadModal = ({
  teamId,
  parentRef,
  offModal,
}: IClubSquadModalProps) => {
  // performance 측정 1592ms
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
      {/* <ProfileComp id={`ClubSquadModal-${teamId}`}> */}
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
      {/* </ProfileComp> */}
    </>
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

// TODO: Profile: 성능 측정 확인
// Profiler.tsx:19 단계: mount
// Profiler.tsx:20 렌더링 시간: 1.8000000715255737
// Profiler.tsx:21 baseDuration: 1.5
// Profiler.tsx:18 컴포넌트: ClubSquadModal
// 처음 렌더링
// Profiler.tsx:19 단계: update
// Profiler.tsx:20 렌더링 시간: 6.299999952316284
// Profiler.tsx:21 baseDuration: 4.299999833106995
// Profiler.tsx:18 컴포넌트: ClubSquadModal

// 리렌더링, 캐싱
// Profiler.tsx:19 단계: mount
// Profiler.tsx:20 렌더링 시간: 2.9000000953674316
// Profiler.tsx:21 baseDuration: 1.8000000715255737

// player memo,
// handleClick inline 변경, {()=>fn(name)} -> {fn} :memo 깨짐 + diff 비용 증가

// Profiler.tsx:19 단계: mount
// Profiler.tsx:20 렌더링 시간: 0.3999999761581421
// Profiler.tsx:21 baseDuration: 0.3999999761581421

// Profiler.tsx:19 단계: update
// Profiler.tsx:20 렌더링 시간: 4.199999928474426
// Profiler.tsx:21 baseDuration: 3.600000023841858

// Profiler.tsx:19 단계: mount
// Profiler.tsx:20 렌더링 시간: 3.600000023841858
// Profiler.tsx:21 baseDuration: 2

//
// handleClick inline 변경 x
// Profiler.tsx:19 단계: mount
// Profiler.tsx:20 렌더링 시간: 1.899999976158142
// Profiler.tsx:21 baseDuration: 1.7000000476837158

// Profiler.tsx:19 단계: update
// Profiler.tsx:20 렌더링 시간: 4.200000047683716
// Profiler.tsx:21 baseDuration: 2.9000000953674316

// Profiler.tsx:19 단계: mount
// Profiler.tsx:20 렌더링 시간: 3.299999952316284
// Profiler.tsx:21 baseDuration: 2.399999976158142

// 3 deps 변경
// useModalPosition(listRef, parentRef, [players, isPending])
// useModalPosition(listRef, parentRef, [players.length, isPending])

// getBoundingClientRect: 호출 순간 요소의 크기/위치 스냅샷
// 자주 호출하면 리플로우가 발생할 수 있습니다. > 성능문제
// 요소의 위치를 잡기 위해 주로 사용. 뷰포트 기준 위치

// 4 useModalPosition 수정
