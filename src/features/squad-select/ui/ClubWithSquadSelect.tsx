import { useQueryClient } from '@tanstack/react-query'
import { lazy, memo, Suspense, useEffect, useRef } from 'react'

import { prefetchTeamPlayersId } from '@/entities/club'
import type { IFirebaseTeamDetail } from '@/shared'
import * as S from './ClubWithSquadSelect.style'
import { useClubSquadModalTrigger } from '../model'

const ClubSquadModalLazy = lazy(() => import('./ClubSquadModal'))

const ClubWithSquadSelect = ({
  logo,
  name,
  id,
  offTablet,
}: IFirebaseTeamDetail & {
  offTablet: () => void
}) => {
  const queryClient = useQueryClient()
  const parentRef = useRef<HTMLImageElement>(null)
  const {
    isHover,
    shouldRenderModal,
    handleMouseEnter,
    handleMouseLeave,
    handleModalClose,
  } = useClubSquadModalTrigger({ onClose: offTablet })

  useEffect(() => {
    if (!id) return
    prefetchTeamPlayersId(queryClient, { teamId: id })
  }, [id, queryClient])

  return (
    <>
      <S.Container
        $isActive={isHover}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <S.Emblem
          src={logo}
          alt={name}
          ref={parentRef}
          width='60'
          height='60'
        />
        {shouldRenderModal && isHover && (
          <Suspense fallback={null}>
            <ClubSquadModalLazy
              teamId={id}
              parentRef={parentRef}
              offModal={handleModalClose}
            />
          </Suspense>
        )}
      </S.Container>
    </>
  )
}

export default memo(ClubWithSquadSelect)
