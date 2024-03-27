import { Tabs } from '@mantine/core'
import { useLoaderData } from '@remix-run/react'
import { IconMessageCircle, IconPhoto } from '@tabler/icons-react'
import { useState } from 'react'
import { StocksTable } from './components/StocksTable'
import { OrderHistory } from './components/OrderHistory'
import { homeLoader } from '../application/loader.server'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string | null>('stocks')
  const loaderData = useLoaderData<typeof homeLoader>()
  const { stocks, events } = loaderData.data

  return (
    <div className="remix__page">
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        color="indigo"
        radius="md"
        defaultValue="gallery"
      >
        <Tabs.List>
          <Tabs.Tab value="stocks" leftSection={<IconPhoto size="0.8rem" />}>
            Stocks Overiew
          </Tabs.Tab>
          <Tabs.Tab
            value="history"
            leftSection={<IconMessageCircle size="0.8rem" />}
          >
            Order History
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="stocks" pt="md">
          <StocksTable stocks={stocks} />
        </Tabs.Panel>
        <Tabs.Panel value="history" pt="md">
          <OrderHistory orderHistories={events} />
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}
