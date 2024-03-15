import { useLoaderData } from "@remix-run/react";
import { Container, Table } from '@mantine/core';
import { getUserSessionEmail } from "~/utils/session.server";
import { getUser, getSalesInvoices } from "~/utils/db.server";

const generateRows = (orderHistory: any[]) => {
  console.log(orderHistory);
  return (
    orderHistory.map((data: any, index: number) => (
      <tr key={index + data.itemCode}>
        <td>{data.Code}</td>
        <td>{data.DocNo}</td>
        <td>{data.Description}</td>
        <td>{data.Data.map((item: any) => item.ItemCode).toString()}</td>
        <td>{Date.parse(data.createdAt["_seconds"].toString())}</td>
        <td>{data.status}</td>
      </tr>
  )
))};

export function OrderHistory({ orderHistory } : { orderHistory : any}) {
  return (
    <Container>
      <Table striped withBorder>
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
