import { StrictMode } from 'react'
import { ThemeProvider } from 'styled-components'
import { createRoot } from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClientProvider } from '@tanstack/react-query'

import AppRouterProvider from '@/app/providers/AppRouterProvider'
import { theme } from '@/styles/theme'
import { queryClient } from '@/lib/queryClient'
import { setupQueryPersist } from '@/lib/persistClient'

setupQueryPersist()

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ThemeProvider theme={theme}>
          <RecoilRoot>
            <AppRouterProvider />
          </RecoilRoot>
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </StrictMode>,
)
