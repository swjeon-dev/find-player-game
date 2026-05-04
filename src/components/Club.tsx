import styled, { css } from 'styled-components'
import ClubSquadModal from './ClubSquadModal'
import { useMemo, useRef, useState } from 'react'
import type { IFirebaseTeamDetail } from '../types'
import useDebouncedValue from '../hooks/useDebouncedValue'
import routerPath from '@/constant/routerPath'

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
  const [isHover, setIsHover] = useState(false)
  const [clicked, setClicked] = useState(false)
  const onLazyModal = useDebouncedValue(isHover, 300)
  const parentRef = useRef<HTMLImageElement>(null)

  const activeModal = useMemo(() => {
    return location.pathname === pathWithBasename
  }, [location.pathname])

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
  return (
    <Container
      $isActive={activeModal && isHover}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Emblem src={logo} alt={name} ref={parentRef} width='60' height='60' />
      {activeModal && onLazyModal && isHover && (
        <ClubSquadModal id={id} parentRef={parentRef} offModal={offModal} />
      )}
    </Container>
  )
}

export default Club
