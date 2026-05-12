import styled from 'styled-components'

import { SkeletonBase } from '@/utils/skeletonUI'

export const FormContainer = styled.div<{ $isPending: boolean }>`
  position: relative;
  width: 100%;
  height: 280px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin: 0 auto 30px;
  background-color: white;
  border-radius: 15px;
  padding-bottom: 15px;

  opacity: ${props => (props.$isPending ? '0.8' : '1')};
  z-index: 10;

  ${({ theme }) => theme.media.mobile} {
    width: 100%;
    border-radius: 0;
  }
`

export const PhotoSkeleton = styled(SkeletonBase)`
  width: 160px;
  height: 180px;
  border-radius: 35px;
  margin-bottom: 20px;
`

export const Photo = styled.img<{ $isCorrect: boolean }>`
  width: 160px;
  height: 180px;
  border-radius: 20px;
  margin-top: 10px;
  margin-bottom: 20px;
  ${props => (props.$isCorrect ? null : 'filter: blur(13px)')};

  animation: showing-image 0.3s ease-out forwards;

  @keyframes showing-image {
    0% {
      opacity: 0;
      transform: translateX(20px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
`
