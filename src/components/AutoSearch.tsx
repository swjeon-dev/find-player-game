import styled, { css } from 'styled-components'
import { useEffect, useRef } from 'react'
import type { IFirebasePlayer } from 'shared/api.types'

const AutoSearchBox = styled.ul`
  width: 70%;
  max-height: 200px;
  overflow-y: auto;
  color: red;
  margin: 0 auto;
  border: 1.3px solid rgba(59, 59, 59, 0.4);
  background-color: white;
  border-radius: 0 0 5px 5px;
`
const PlayerBox = styled.button<{ $selected: boolean }>`
  width: 100%;
  height: 35px;
  font-size: 15px;
  font-weight: bold;
  color: rgba(59, 59, 59, 0.5);

  ${props =>
    props.$selected
      ? css`
          border: 2px solid black;
        `
      : css`
          border-color: transparent;
        `}
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 10px;
  background-color: white;
  box-shadow: 0px 3px 12px black;
  &:hover {
    cursor: pointer;
  }
`
const ClubEmblem = styled.img`
  width: 25px;
  height: 25px;
`
const Name = styled.span`
  margin: auto 0;
`
interface IAutoSearchProps {
  filteredPlayers: IFirebasePlayer[]
  handleSelect: (player: IFirebasePlayer) => void
  focusedIndex: number
}

const AutoSearch = ({
  filteredPlayers,
  handleSelect,
  focusedIndex,
}: IAutoSearchProps) => {
  const listRef = useRef(null)

  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const selectElement = listRef.current.children[
        focusedIndex
      ] as HTMLUListElement
      if (selectElement) {
        selectElement.scrollIntoView({ behavior: 'auto', block: 'nearest' })
      }
    }
  }, [focusedIndex])

  return (
    filteredPlayers?.length > 0 && (
      <AutoSearchBox ref={listRef}>
        {filteredPlayers.map((player, idx) => {
          return (
            <PlayerBox
              key={player.id}
              type='button'
              $selected={focusedIndex === idx}
              onClick={() => handleSelect(player)}
            >
              <ClubEmblem
                src={player.teamLogo || ''}
                alt={player.teamId.toString()}
                width='25'
                height='25'
              />
              <Name>{player.name}</Name>
            </PlayerBox>
          )
        })}
      </AutoSearchBox>
    )
  )
}

export default AutoSearch
