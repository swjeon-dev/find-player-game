import { createPortal } from 'react-dom'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useSetRecoilState } from 'recoil'

import routerPath from '@/constant/routerPath'

import emblemImage from '/emblem/pl.webp'
import { leagueInfoState } from '@/atoms/quizState'

const Dialog = styled.dialog`
  width: 80%;
  max-width: 500px;
  height: 280px;
  background-color: #6b7280;
  border-radius: 15px;
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
const pl = {
  id: 39, // pl
  season: 2024, // 26년 기준 최신
}

export default function Modal({ closeModal }: { closeModal: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const navigate = useNavigate()
  const setLeagueInfo = useSetRecoilState(leagueInfoState)

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal()
      dialogRef.current?.scrollTo({ top: 0 })
    }
  }, [])

  // TODO: +league id 전역 상태 저장
  const setLeagueRange = () => {
    setLeagueInfo(pl)
    navigate(routerPath.SUBMISSION)
  }

  return createPortal(
    <Dialog
      ref={dialogRef}
      onMouseDown={e => {
        if (e.target === e.currentTarget) {
          closeModal()
        }
      }}
      onClose={() => closeModal()}
    >
      <Container onClick={e => e.stopPropagation()}>
        <Title>Select League you want</Title>
        <BoxContainer>
          <Box onClick={setLeagueRange} aria-label='리그 선택'>
            <Emblem src={emblemImage} width='70' height='70' alt='PL image' />
            <Span>PL</Span>
          </Box>
        </BoxContainer>
      </Container>
    </Dialog>,
    document.getElementById('modal-root') as HTMLElement,
  )
}
