import { useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { signOut, getUserSession } from "~/utils/session.server";
import { getStocks, getSalesInvoices } from "~/utils/db.server";
import { Button, Table, Flex, Title } from '@mantine/core';

// https://remix.run/api/conventions#meta
export let meta = () => {
  return {
    title: "Remix Starter",
    description: "Welcome to remix!",
  };
};

export let action = ({ request }: {request : Request}) => {
  return signOut(request);
};

export let loader = async ({ request }: {request : Request}) => {
  const sessionUser = await getUserSession(request);
  if (!sessionUser) {
    return redirect("/login") 
  }
  const stocks = await getStocks();
  const salesInvoice = await getSalesInvoices();
  salesInvoice.docs.forEach(doc => console.log(doc.data()))
  if (!stocks.exists) {
    throw null;
  } else {
    return stocks.data();
  }
};

const generateRows = (stocksData: any) => {
  const parsedStocksData = Object.values(stocksData);
  return (
    parsedStocksData.map((data: any) => (
      <tr key={data.itemCode}>
        <td>{data.itemCode}</td>
        <td>{data.batch}</td>
        <td>{data.location}</td>
        <td>{data.quantity}</td>
      </tr>
  )
))};


// https://remix.run/guides/routing#index-routes
export default function Index() {
  const stocksData = useLoaderData();
  return (
    <div className="remix__page">
      <main>
        <Flex gap={"sm"} pb={10}>
          <Title order={2}>Stocks Overview</Title>
          <Button>Refresh Stocks</Button>
        </Flex>
        <Table striped withBorder>
          <thead>
            <tr>
              <th>Item Code</th>
              <th>Batch</th>
              <th>Location</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>{generateRows(stocksData)}</tbody>
        </Table>
        <Flex gap={"sm"} pb={10}>
          <Title order={2}>Order History</Title>
        </Flex>

      </main>
    </div>
  );
}
