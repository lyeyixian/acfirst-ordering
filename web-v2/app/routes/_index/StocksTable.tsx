import { useFetcher } from '@remix-run/react'
import { Button, Container, Table } from '@mantine/core'
import { Stock } from '~/firebase.server'

const generateRows = (stocksData: Stock[]) => {
  return stocksData.map((data, index) => (
    <tr key={index + data.itemCode}>
      <td>{data.itemCode}</td>
      <td>{data.batch}</td>
      <td>{data.location}</td>
      <td>{data.quantity}</td>
    </tr>
  ))
}

export function StocksTable({ stocks }: { stocks: Stock[] }) {
  const refreshStocksFetcher = useFetcher()
  return (
    <Container>
      <refreshStocksFetcher.Form method="post" action="/api/events">
        <input type="hidden" name="event" value={'refreshStocks'} />
        <input type="hidden" name="payload" value={''} />
        <Button mb={10} type="submit">
          Refresh Stocks
        </Button>
      </refreshStocksFetcher.Form>

      <Table horizontalSpacing="xl" striped withTableBorder highlightOnHover>
        <thead>
          <tr>
            <th>Item Code</th>
            <th>Batch</th>
            <th>Location</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>{generateRows(stocks)}</tbody>
      </Table>
    </Container>
  )
}
