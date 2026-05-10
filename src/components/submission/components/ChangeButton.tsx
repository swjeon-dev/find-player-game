import { AlertButton } from '../styles'

interface ChangeButtonProps {
  onClick: () => void
}

const ChangeButton = ({ onClick }: ChangeButtonProps) => {
  return (
    <AlertButton onClick={onClick}>
      <span>문제 변경</span>
    </AlertButton>
  )
}

export default ChangeButton
