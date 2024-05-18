import { AppShell } from '@mantine/core'
import HeaderTabs from '~/components/HeaderTabs'
import RouterTransition from './RouterTransition'
import React from 'react'

export default function AppContainer({ children }: React.PropsWithChildren) {
  return (
    <AppShell header={{ height: 56 }} padding="md">
      <AppShell.Header>
        <HeaderTabs />
      </AppShell.Header>

      <AppShell.Main>
        <RouterTransition />
        {children}
      </AppShell.Main>
    </AppShell>
  )
}
