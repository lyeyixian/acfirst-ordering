import { redirect } from "@remix-run/node";
import { getUserSession, getUserSessionEmail } from "~/utils/session.server";
import { getStocks, getSalesInvoices, getUser } from "~/utils/db.server";
import { Tabs, Flex, Title } from '@mantine/core';
import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons-react';
import { StocksTable } from "~/components/StocksTable/StocksTable";
import { useState } from "react";
import { OrderHistory } from "~/components/OrderHistory/OrderHistory";
import { useLoaderData } from "@remix-run/react";

// https://remix.run/api/conventions#meta
export let meta = () => {
  return {
    title: "acfirst ordering system",
    description: "acfirst ordering system!",
  };
};

export let loader = async ({ request }: {request : Request}) => {
  const sessionUser = await getUserSession(request);
  if (!sessionUser) {
    return redirect("/login") 
  }
  const stocks = await getStocks();
  if (!stocks.exists) {
    throw null;
  }

  const userEmail = await getUserSessionEmail(request);
  const user = await getUser(userEmail);

  if (!user.exists || user.data() === null || user.data() === undefined) {
    throw new Error('Missing user information!')
  }
  const salesInvoices = await getSalesInvoices(user.data().username);
  if (!salesInvoices) {
    throw null;
  }

  const parsedSalesInvoices = salesInvoices.map(salesInvoice => salesInvoice.data());
  return { stocks: stocks.data(), salesInvoices: parsedSalesInvoices }

};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  const [activeTab, setActiveTab] = useState<string | null>('history');
  const {stocks, salesInvoices} = useLoaderData();

  return (
    <div className="remix__page">
      <Tabs value={activeTab} onTabChange={setActiveTab} color="indigo" radius="md" defaultValue="gallery">
      <Tabs.List>
        <Tabs.Tab value="stocks" icon={<IconPhoto size="0.8rem" />}>Stocks Overiew</Tabs.Tab>
        <Tabs.Tab value="history" icon={<IconMessageCircle size="0.8rem" />}>Order History</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="stocks" pt="md">
        <StocksTable stocks={stocks}/>
      </Tabs.Panel>
      <Tabs.Panel value="history" pt="md">
        <OrderHistory orderHistory={salesInvoices}/>
      </Tabs.Panel>
      </Tabs>
    </div>
  );
}
