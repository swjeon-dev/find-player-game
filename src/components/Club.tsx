import { useQueryClient } from '@tanstack/react-query'
import { memo, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import routerPath from '@/constant/routerPath'
import { prefetchTeamPlayersId } from '@/hooks/useFetchingTeamPlayers'
import ClubSquadModal from './ClubSquadModal'
import type { IFirebaseTeamDetail } from '../types'
import useDebouncedValue from '../hooks/useDebouncedValue'
import ProfileComp from './Profiler'

const Container = styled.div<{ $isActive: boolean }>`
  min-width: 70px;
  aspect-ratio: 1/1;
  position: relative;
  text-align: center;
  padding: 5px;
  transition: transform 0.3s ease-in-out;

  ${props =>
    props.$isActive
      ? css`
          cursor: pointer;
          &:hover {
            transform: scale(1.05);
            z-index: 5;
          }
        `
      : css`
          cursor: auto;
        `}
`

const Emblem = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
  display: block; /* 하단 여백 제거 */
`

const pathWithBasename = `/find-player-game${routerPath.SUBMISSION}`

const Club = ({ logo, name, id }: IFirebaseTeamDetail) => {
  const queryClient = useQueryClient()
  const [isHover, setIsHover] = useState(false)
  const [clicked, setClicked] = useState(false)
  const onLazyModal = useDebouncedValue(isHover, 300)
  const parentRef = useRef<HTMLImageElement>(null)

  const activeModal = location.pathname === pathWithBasename

  const handleMouseEnter = () => {
    if (clicked) return
    setIsHover(true)
  }
  const handleMouseLeave = () => {
    setClicked(false)
    setIsHover(false)
  }
  const offModal = () => {
    setIsHover(false)
    setClicked(true)
  }

  useEffect(() => {
    if (!id) return
    prefetchTeamPlayersId(queryClient, { teamId: id })
  }, [id, queryClient])

  return (
    <>
      {/* <ProfileComp id='Club'> */}
      <Container
        $isActive={activeModal && isHover}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Emblem src={logo} alt={name} ref={parentRef} width='60' height='60' />
        {activeModal && onLazyModal && isHover && (
          <>
            {/* <ProfileComp id={`ClubSquadModal-${id}`}> */}
            <ClubSquadModal
              teamId={id}
              parentRef={parentRef}
              offModal={offModal}
            />
            {/* </ProfileComp> */}
          </>
        )}
      </Container>
      {/* </ProfileComp> */}
    </>
  )
}

export default memo(Club)
