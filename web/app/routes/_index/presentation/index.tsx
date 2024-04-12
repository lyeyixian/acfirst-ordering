import { useLoaderData } from '@remix-run/react'
import { StocksTable } from './components/StocksTable'
import { OrderHistory } from './components/OrderHistory'
import { homeLoader } from '../application/loader.server'
import { AppShell, Space } from '@mantine/core'
import { Navbar } from '~/components/Navbar/Navbar'
import RouterTransition from '~/components/RouterTransition'
import { useDisclosure } from '@mantine/hooks'

export default function HomePage() {
  const loaderData = useLoaderData<typeof homeLoader>()
  const { stocks, events } = loaderData.data
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell padding={0} navbar={{
      width: 300,
      breakpoint: 'sm',
      collapsed: { mobile: !opened },
    }}>
      <AppShell.Navbar p="md">
        <Navbar/>
      </AppShell.Navbar>

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
