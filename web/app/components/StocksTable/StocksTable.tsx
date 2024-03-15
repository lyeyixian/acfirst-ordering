import { useFetcher } from "@remix-run/react";
import { Button, Container, Table } from '@mantine/core';

const generateRows = (stocksData: any) => {
  const parsedStocksData = Object.values(stocksData);
  return (
    parsedStocksData.map((data: any, index: number) => (
      <tr key={index + data.itemCode}>
        <td>{data.itemCode}</td>
        <td>{data.batch}</td>
        <td>{data.location}</td>
        <td>{data.quantity}</td>
      </tr>
  )
))};

export function StocksTable({ stocks } : {stocks :any}) {
  const refreshStocksFetcher = useFetcher()
  return (
    <Container>
      <refreshStocksFetcher.Form method="post" action="/api/events">
        <input type="hidden" name="event" value={"refreshStocks"} />
        <Button mb={10} type="submit">Refresh Stocks</Button>
      </refreshStocksFetcher.Form>

      <Table horizontalSpacing="xl" striped withBorder highlightOnHover>
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
