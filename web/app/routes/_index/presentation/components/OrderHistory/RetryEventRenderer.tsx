import { CustomCellRendererProps } from "ag-grid-react";
import { IconCircleCheck, IconCircleX, IconLoader, IconPlayerPause } from '@tabler/icons-react';
import { EventStatus } from "~/common/type";
import { Button, Flex } from "@mantine/core";
import { useFetcher } from "@remix-run/react";

// eslint-disable-next-line react/display-name
export default (params: CustomCellRendererProps) => {
    const retryEventFetcher = useFetcher()
    switch(params.value) {
        case EventStatus.FAILED:
            return (
                <Flex>
                    <IconCircleX color={"red"}/>
                    <retryEventFetcher.Form method="post">
                    <input type="hidden" name="orderId" value={params.data["Order ID"]} />
                    <Button type="submit" size="xs">
                        Retry
                    </Button>
                    </retryEventFetcher.Form>
                </Flex>
            )
        case EventStatus.COMPLETED:
            return (
                <span>
                    <IconCircleCheck color={"green"}/>
                     Completed
                </span>
                )
        case EventStatus.QUEUED:
            return (
                <span>
                    <IconPlayerPause/>
                    In Queue
                </span>

            )
        case EventStatus.PROCESSING:
            return (
                <span>
                    <IconLoader/>
                    Processing
                </span>

            )
        default:
            return params.value
    }
}