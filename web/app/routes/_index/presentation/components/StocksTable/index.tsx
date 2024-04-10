import { useFetcher } from '@remix-run/react'
import { useState, useEffect } from 'react';
import { Button, Container } from '@mantine/core'
import { EventType, Stock, StockRowData } from '~/common/type'

import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid

export function StocksTable({ stocks }: { stocks: Stock[] }) {
  const numberSort = (num1: number, num2: number) => {
    return num1 - num2;
  };

  const refreshStocksFetcher = useFetcher()
  const [rowData, setRowData] = useState<StockRowData[]>([])
  const [colDefs, setColDefs] = useState([
    { field: "Item Code", filter: 'agTextColumnFilter' },
    { field: "Batch", filter: 'agTextColumnFilter' },
    { field: "Location", filter: 'agTextColumnFilter' },
    { field: "Quantity", filter: 'agNumberColumnFilter', sortable: true, comparator: numberSort},
    { field: "Price per Unit (MYR)", filter: 'agNumberColumnFilter', sortable: true, comparator: numberSort}
  ]);

  useEffect(() => {
    const rows: StockRowData[] = [];
    stocks.map((data) => {
      rows.push({"Item Code": data.itemCode, "Batch": data.batch, "Location": data.location, "Quantity": data.quantity, "Price per Unit (MYR)": data.pricePerUnit})
    })
    setRowData(rows)
  }, [stocks]);

  return (
    <Container size={1080}>
      <refreshStocksFetcher.Form method="post">
        <input type="hidden" name="type" value={EventType.REFRESH_STOCKS} />
        <Button mb={10} type="submit">
          Refresh Stocks
        </Button>
      </refreshStocksFetcher.Form>

      <div
        className="ag-theme-quartz" // applying the grid theme
        style={{ height: 700, width: "100%"}} // the grid will fill the size of the parent container
      >
        <AgGridReact
            rowHeight={35}
            rowData={rowData}
            columnDefs={colDefs}
        />
      </div>
    </Container>
  )
}
