import { useLoaderData } from '@remix-run/react'
import { StocksTable } from './components/StocksTable'
import { OrderHistory } from './components/OrderHistory'
import { homeLoader } from '../application/loader.server'
import { Container, Space } from '@mantine/core'

export default function HomePage() {
  const loaderData = useLoaderData<typeof homeLoader>()
  const { stocks, events } = loaderData.data

  return (
    <Container>
      <Space h="md" />
      <OrderHistory orderHistories={events} />
      <Space h="md" />
      <StocksTable stocks={stocks} />
    </Container>
  )
}
