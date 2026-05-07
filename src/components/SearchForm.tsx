import { useEffect, useMemo, useState } from 'react'
import { useRecoilState } from 'recoil'
import styled from 'styled-components'

import useDebouncedValue from '@/hooks/useDebouncedValue'
import { inputState } from '@/state'
import AutoSearch from './AutoSearch'
import type { IHint } from '@/types'
import type { IFirebasePlayer } from '@/api/api.types'

interface IForm {
  quiz: IFirebasePlayer
  squad: IFirebasePlayer[]
  disabled: boolean
  setIsCorrect: React.Dispatch<boolean>
  setHintArr: React.Dispatch<React.SetStateAction<IHint[]>>
}

const Input = styled.input`
  width: 70%;
  height: 35px;
  border: 1.3px solid #3b3b3b;
  text-align: start;
  font-size: 17px;
  font-weight: bold;
  outline: none;
  padding-left: 10px;
  border-radius: 5px;
  &::placeholder {
    color: #979dac;
  }
`

function SearchForm({
  quiz,
  squad,
  disabled,
  setIsCorrect,
  setHintArr,
}: IForm) {
  const [value, setValue] = useRecoilState(inputState)

  const [focusedIndex, setFocusedIndex] = useState(-1)

  const debouncedValue = useDebouncedValue(value, 500)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value)
  }

  const filteredPlayerss: IFirebasePlayer[] = useMemo(() => {
    if (disabled) return []
    if (debouncedValue.length < 3) return []

    const regex = new RegExp(debouncedValue, 'i')
    return squad.filter(player => regex.test(player.name))
  }, [squad, debouncedValue, disabled])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredPlayerss.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex(prev =>
        prev < filteredPlayerss.length - 1 ? prev + 1 : prev,
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === 'Enter') {
      const targetPlayer =
        filteredPlayerss[focusedIndex === -1 ? 0 : focusedIndex]
      if (targetPlayer) handleSelect(targetPlayer)
    } else if (e.key === 'Escape') {
      setFocusedIndex(-1)
    }
  }

  const handleSelect = (player: IFirebasePlayer) => {
    setFocusedIndex(-1)
    submitPlayer(player)
  }

  // 기존 onSubmit의 핵심 로직을 별도 함수로 분리
  const submitPlayer = (player: IFirebasePlayer) => {
    if (disabled) return
    const hintObj: IHint = { q: quiz, a: player }

    setHintArr(prev => {
      if (prev.find(h => h.a.id === player.id)) {
        alert('이미 입력한 이름입니다.')
        return prev
      }
      return [hintObj, ...prev]
    })

    if (quiz.id === player.id) {
      setIsCorrect(true)
      setFocusedIndex(-1)
    } else {
      setValue('')
    }
  }

  const onSubmit = (e: React.SubmitEvent) => e.preventDefault()

  useEffect(() => {
    setValue('')
  }, [])

  // 검색어가 바뀌면 포커스 초기화
  useEffect(() => {
    setFocusedIndex(-1)
  }, [debouncedValue])

  return (
    <form onSubmit={onSubmit}>
      <Input
        disabled={disabled}
        onKeyDown={onKeyDown}
        value={value}
        onChange={onChange}
        placeholder='Write a Full-name'
        autoComplete='off'
      />

      {debouncedValue.length > 2 && (
        <AutoSearch
          filteredPlayers={filteredPlayerss}
          handleSelect={handleSelect}
          focusedIndex={focusedIndex}
        />
      )}
    </form>
  )
}

export default SearchForm
