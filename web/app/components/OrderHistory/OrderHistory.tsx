import { Container, List, Table } from '@mantine/core';

const parseDate = (date: any) => {
  const firebaseDateTime = new Date(date._seconds * 1000 + date._nanoseconds / 100000);
  return firebaseDateTime.toLocaleDateString() + "\n" + firebaseDateTime.toLocaleTimeString();
}

const parseItems = (items: any[]) => {
  return (
    <List size="xs">
      {items.map((item: any) =>
        <List.Item key={item.ItemCode}>{item.ItemCode}: {item.Qty}</List.Item>
      )}
    </List>
  )
}
const generateRows = (orderHistory: any[]) => {
  return (
    orderHistory.map((data: any, index: number) => (
      <tr key={index + data.itemCode}>
        <td>{data.Code}</td>
        <td>{data.DocNo}</td>
        <td>{data.Description}</td>
        <td>{parseItems(data.Data)}</td>
        <td>{parseDate(data.createdAt)}</td>
        <td>{data.status}</td>
      </tr>
  )
))};

export function OrderHistory({ orderHistory } : { orderHistory : any}) {
  return (
    <Container>
      <Table horizontalSpacing="xl" striped withBorder highlightOnHover>
          <thead>
            <tr>
              <th>Code</th>
              <th>DocNo</th>
              <th>Description</th>
              <th>Data</th>
              <th>Created Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>{generateRows(orderHistory)}</tbody>
        </Table>
    </Container>
  )
}
