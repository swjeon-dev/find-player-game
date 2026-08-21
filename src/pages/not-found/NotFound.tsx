import { Helmet } from 'react-helmet-async'

import { PageMeta, ROUTER_PATH } from '@/shared'

import * as S from './NotFound.style'

function NotFound() {
  return (
    <>
      <PageMeta
        title='404'
        description='요청하신 페이지를 찾을 수 없습니다.'
        noIndex
      />

      <S.Page>
        <S.Card>
          <S.Content>
            <S.Title>페이지를 찾을 수 없습니다.</S.Title>
            <S.Description>
              잘못된 페이지 접근입니다. 홈으로 이동해주세요.
            </S.Description>
            <S.Actions>
              <S.ActionLink to={ROUTER_PATH.HOME}>홈으로 이동</S.ActionLink>
            </S.Actions>
          </S.Content>
        </S.Card>
      </S.Page>
    </>
  )
}

export default NotFound
