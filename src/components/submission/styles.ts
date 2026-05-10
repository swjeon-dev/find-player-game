import styled from 'styled-components'

import { SkeletonBase } from '@/utils/skeletonUI'

export const Container = styled.div`
  position: relative;
  width: 500px;
  min-height: 300px;
  border-radius: 15px;
  margin-bottom: 50px;

  ${({ theme }) => theme.media.mobile} {
    width: 100%;
  }
`

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

export const AlertButton = styled.button`
  position: absolute;
  top: 5%;
  right: 5%;
  z-index: 10;

  font-size: 15px;
  background: rgb(65 105 225 / 62%);
  box-shadow: 0 2px #4169e1;
  color: white;
  padding: 0.5em 0.8em;
  display: flex;
  align-items: center;
  border: none;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
`

export const RetryButton = styled.button`
  margin-top: 14px;
  font-size: 16px;
  background: rgb(255 255 255 / 92%);
  color: #1a1a1a;
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  cursor: pointer;
`

export const LoadingWrapper = styled(Container)`
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;

  background-color: skyblue;
  border-radius: 15px;
  padding: 10px 20px;

  & div {
    margin-bottom: 15px;
  }

  & span {
    font-size: 2rem;
    font-weight: bold;
    line-height: 3rem;
    color: white;
  }
`
