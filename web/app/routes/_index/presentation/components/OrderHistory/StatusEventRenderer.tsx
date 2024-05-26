import { CustomCellRendererProps } from 'ag-grid-react'
import {
  IconCircleCheck,
  IconCircleX,
  IconLoader,
  IconPlayerPause,
} from '@tabler/icons-react'
import { EventStatus } from '~/common/type'
import { Flex } from '@mantine/core'

// eslint-disable-next-line react/display-name
export default (params: CustomCellRendererProps) => {
  switch (params.value) {
    case EventStatus.FAILED:
      return (
        <Flex mt="sm">
          <IconCircleX color={'red'} />
        </Flex>
      )
    case EventStatus.COMPLETED:
      return (
        <Flex mt="sm">
          <IconCircleCheck color={'green'} />
        </Flex>
      )
    case EventStatus.QUEUED:
      return (
        <Flex mt="sm">
          <IconPlayerPause />
        </Flex>
      )
    case EventStatus.PROCESSING:
      return (
        <Flex mt="sm">
          <IconLoader />
        </Flex>
      )
    default:
      return params.value
  }
}
