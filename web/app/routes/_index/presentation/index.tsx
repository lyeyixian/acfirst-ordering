import { useLoaderData } from '@remix-run/react'
import { StocksTable } from './components/StocksTable'
import { OrderHistory } from './components/OrderHistory'
import { homeLoader } from '../application/loader.server'
import { AppShell, Space } from '@mantine/core'
import RouterTransition from '~/components/RouterTransition'
import HeaderTabs from './components/HeaderTabs'

export default function HomePage() {
  const loaderData = useLoaderData<typeof homeLoader>()
  const { stocks, events } = loaderData.data

  return (
    <AppShell header={{ height: 56 }} padding="md">
      <AppShell.Header>
        <HeaderTabs />
      </AppShell.Header>

      <AppShell.Main>
        <RouterTransition />
        <div className="remix__page">
          <Space h="md" />
          <OrderHistory orderHistories={events} />
          <Space h="md" />
          <StocksTable stocks={stocks} />
        </div>
      </AppShell.Main>
    </AppShell>
  )
}
