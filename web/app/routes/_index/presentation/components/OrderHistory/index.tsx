import { Title } from '@mantine/core'
import { AgGridReact } from 'ag-grid-react'
import { Timestamp } from 'firebase-admin/firestore'
import { useEffect, useState } from 'react'
import { Event, EventPayload, EventRowData, EventType } from '~/common/type'
import EventTypeRenderer from './EventTypeRenderer'
import StatusEventRenderer from './StatusEventRenderer'
import ActionEventRenderer from './ActionEventRenderer'

const parseDate = (date: Timestamp) => {
  try {
    return date.toDate()
  } catch {
    const firebaseDateTime = new Date(
      date._seconds * 1000 + date._nanoseconds / 100000
    )
    return firebaseDateTime
  }
}

const parsePayload = (payload: EventPayload | null) => {
  if (payload === null) return ''
  let payloadString: string = ''
  payloadString += 'Company Code: ' + payload.Code + '\n'
  payload.Data.map((item, index) => {
    payloadString += index + 1 + '. ' + item.ItemCode + ': ' + item.Qty + '\n'
  })
  return payloadString
}

export function OrderHistory({ orderHistories }: { orderHistories: Event[] }) {
  const [rowData, setRowData] = useState<EventRowData[]>([])
  const [colDefs, setColDefs] = useState([
    { field: 'Order ID', filter: 'agTextColumnFilter' },
    {
      field: 'Type',
      filter: 'agTextColumnFilter',
      cellRenderer: EventTypeRenderer,
    },
    {
      field: 'Order',
      filter: 'agTextColumnFilter',
      minWidth: 300,
      wrapText: true,
      autoHeight: true,
      cellStyle: { whiteSpace: 'pre' },
    },
    { field: 'Created At', filter: 'agDateColumnFilter' },
    { field: 'Updated At', filter: 'agDateColumnFilter' },
    { field: 'Created By', filter: 'agTextColumnFilter' },
    {
      field: 'Status',
      cellRenderer: StatusEventRenderer,
      pinned: 'right',
      lockPosition: 'right',
      maxWidth: '75',
    },
    {
      field: 'Action',
      cellRenderer: ActionEventRenderer,
      pinned: 'right',
      lockPosition: 'right',
      maxWidth: '160',
    },
  ])

  useEffect(() => {
    const rows: EventRowData[] = []
    orderHistories.map((data) => {
      if (data.type !== EventType.REFRESH_STOCKS) {
        rows.push({
          'Order ID': data.id,
          Type: data.type,
          Order: parsePayload(data.payload),
          Status: data.status,
          'Created By': data.createdBy,
          'Updated At': parseDate(data.updatedAt),
          'Created At': parseDate(data.createdAt),
        })
      }
    })
    setRowData(rows)
  }, [orderHistories])

  return (
    <div>
      <Title order={2} mb={10}>
        Order History
      </Title>
      <div
        className="ag-theme-quartz" // applying the grid theme
        style={{ height: 300, width: '100%' }} // the grid will fill the size of the parent container
      >
        <AgGridReact
          pagination={true}
          paginationAutoPageSize={true}
          enableCellTextSelection
          rowHeight={35}
          rowData={rowData}
          columnDefs={colDefs}
        />
      </div>
    </div>
  )
}
