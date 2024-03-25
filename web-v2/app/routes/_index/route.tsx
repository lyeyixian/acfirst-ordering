import { Tabs } from '@mantine/core'
import { useLoaderData } from '@remix-run/react'
import { IconMessageCircle, IconPhoto } from '@tabler/icons-react'
import { useState } from 'react'
import { homeAction as action, homeLoader as loader } from './index.server'
import { MetaFunction } from '@remix-run/node'
import { StocksTable } from './StocksTable'
import { OrderHistory } from './OrderHistory'

export { loader, action }

export const meta: MetaFunction = () => {
  return [
    { title: 'Acfirst Ordering' },
    { name: 'description', content: 'Welcome to Acfirst Ordering!' },
  ]
}

export default function HomeLayout() {
  const [activeTab, setActiveTab] = useState<string | null>('stocks')
  const loaderData = useLoaderData<typeof loader>()
  const { stocks, events } = loaderData.data

  console.log('DEBUG home layout data:', loaderData)

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