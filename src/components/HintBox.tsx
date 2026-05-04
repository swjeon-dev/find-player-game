import styled from 'styled-components'
import { Position } from 'shared/api.types'
import type { IHint } from '@/types'

const HintList = styled.ul`
  margin-bottom: 40px;
`
const HintItem = styled.li`
  margin-top: 60px;
`
const MyAnswer = styled.h3`
  font-size: 25px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
`
const Row = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
`
const Hint = styled.div<{ $isEqual: boolean }>`
  position: relative;
  width: 80px;
  height: 80px;
  border: 2px solid white;
  border-radius: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 23px;
  font-weight: bold;
  background-color: ${props => (props.$isEqual ? '#06d6a0' : '#8b8c89')};
`
const Label = styled.label`
  position: absolute;
  margin-top: 10px;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: max-content;

  padding: 5px 10px;
  border-radius: 10px;
  color: black;
  background-color: white;
  box-shadow: 0px 2px 5px #8b8c89;

  display: flex;
  align-items: center;
  & span {
    font-size: small;
  }
`

const ClubEmblem = styled.img`
  width: 25px;
  height: 25px;
`

interface IHintBoxProps {
  hintArr: IHint[]
}

const HintBox = ({ hintArr }: IHintBoxProps) => {
  return (
    hintArr &&
    hintArr.length > 0 && (
      <HintList>
        {hintArr.map(({ q, a }) => {
          const {
            teamId: qTeamId,
            number: qNumber,
            age: qAge,
            position: qPosition,
          } = q
          const {
            teamId: aTeamId,
            number: aNumber,
            name: aName,
            age: aAge,
            position: aPosition,
          } = a

          return (
            <HintItem key={a.id}>
              <MyAnswer>{aName}</MyAnswer>
              <Row>
                {[
                  {
                    label: '클럽 이름',
                    value: qTeamId === aTeamId,
                    children: (
                      <ClubEmblem
                        src={a.teamLogo}
                        alt={a.teamId.toString()}
                        width='25'
                        height='25'
                      />
                    ),
                  },
                  {
                    label: '포지션',
                    value: qPosition === aPosition,
                    children: <span>{Position[aPosition]}</span>,
                  },
                  {
                    label: '등 번호',
                    value: qNumber === aNumber,
                    children: (
                      <>
                        <span>{aNumber}</span>
                        <span>
                          {qNumber > aNumber
                            ? '⬆'
                            : qNumber < aNumber
                              ? '⬇︎'
                              : ''}
                        </span>
                      </>
                    ),
                  },
                  {
                    label: '나이',
                    value: qAge === aAge,
                    children: (
                      <>
                        <span>{aAge}</span>
                        <span>
                          {qAge > aAge ? '⬆' : qAge < aAge ? '⬇︎' : ''}
                        </span>
                      </>
                    ),
                  },
                ].map((col, idx) => {
                  return (
                    <HintColumn
                      key={idx}
                      label={col.label}
                      isEqualValue={col.value}
                    >
                      {col.children}
                    </HintColumn>
                  )
                })}
              </Row>
            </HintItem>
          )
        })}
      </HintList>
    )
  )
}

export default HintBox

interface IHintColumn {
  isEqualValue: boolean
  children: React.ReactNode
  label: string
}

function HintColumn({ isEqualValue, children, label }: IHintColumn) {
  return (
    <Hint $isEqual={isEqualValue}>
      {children}
      <Label>
        <span>{label}</span>
      </Label>
    </Hint>
  )
}
