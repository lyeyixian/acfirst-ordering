import { CustomCellRendererProps } from 'ag-grid-react'
import { EventType } from '~/common/type'

export default (params: CustomCellRendererProps) => {
  switch (params.value) {
    case EventType.CREATE_DELIVERY_ORDER:
      return 'Delivery Order'
    case EventType.CREATE_INVOICE:
      return 'Sales Invoice'
    case EventType.REFRESH_STOCKS:
      return 'Refresh Stocks'
    default:
      return params.value
  }
}
