import { useQueryClient } from '@tanstack/react-query'
import { lazy, memo, Suspense, useEffect, useRef } from 'react'
import { useMatch } from 'react-router-dom'

import routerPath from '@/constant/routerPath'
import { prefetchTeamPlayersId } from '@/hooks/data/useFetchingTeamPlayers'

import type { IFirebaseTeamDetail } from '@/types'
import { useClubSquadModalTrigger } from '../model'
import * as S from './Club.style'

const ClubSquadModalLazy = lazy(() =>
  import('@/entities/modal/club').then(m => ({ default: m.ClubSquadModal })),
)

const Club = ({
  logo,
  name,
  id,
  offTablet,
}: IFirebaseTeamDetail & { offTablet: () => void }) => {
  const queryClient = useQueryClient()
  const isSubmissionPage = Boolean(useMatch(routerPath.SUBMISSION))
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
        $isActive={isSubmissionPage && isHover}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <S.Emblem src={logo} alt={name} ref={parentRef} width='60' height='60' />
        {isSubmissionPage && shouldRenderModal && isHover && (
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

export default memo(Club)
