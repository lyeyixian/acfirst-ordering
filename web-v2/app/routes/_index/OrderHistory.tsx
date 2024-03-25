import { Container, Table } from '@mantine/core'
import { Timestamp } from 'firebase-admin/firestore'
import { Event } from '~/firebase.server'

const parseDate = (date: Timestamp) => {
  const firebaseDateTime = new Date(
    date.seconds * 1000 + date.nanoseconds / 100000
  )
  return (
    firebaseDateTime.toLocaleDateString() +
    '\n' +
    firebaseDateTime.toLocaleTimeString()
  )
}

const generateRows = (orderHistories: Event[]) => {
  return orderHistories.map((data, index) => (
    <tr key={index + data.id}>
      <td>{data.id}</td>
      <td>{data.type}</td>
      <td>{JSON.stringify(data.payload)}</td>
      <td>{data.status}</td>
      <td>{data.createdBy}</td>
      <td>{parseDate(data.updatedAt)}</td>
    </tr>
  ))
}

export function OrderHistory({ orderHistories }: { orderHistories: Event[] }) {
  return (
    <Container>
      <Table horizontalSpacing="xl" striped withTableBorder highlightOnHover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Payload</th>
            <th>Status</th>
            <th>Created By</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>{generateRows(orderHistories)}</tbody>
      </Table>
    </Container>
  )
}
