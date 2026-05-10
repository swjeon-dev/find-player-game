import { LoadingWrapper, RetryButton } from '../styles'

interface SubmissionLoaderProps {
  message: string
  onRetry?: () => void
}

export const SubmissionLoader = ({
  message,
  onRetry,
}: SubmissionLoaderProps) => {
  return (
    <LoadingWrapper>
      <div>
        <span>{message}</span>
        {onRetry ? (
          <RetryButton onClick={onRetry}>다시 시도</RetryButton>
        ) : null}
      </div>
    </LoadingWrapper>
  )
}
