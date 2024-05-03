import { CustomCellRendererProps } from "ag-grid-react";
import { IconReload, IconTrash, IconTrashFilled } from '@tabler/icons-react';
import { EventStatus } from "~/common/type";
import { Button, Flex, Modal } from "@mantine/core";
import { useFetcher } from "@remix-run/react";
import { useDisclosure } from "@mantine/hooks";

// eslint-disable-next-line react/display-name
export default (params: CustomCellRendererProps) => {
    const retryEventFetcher = useFetcher()
    const deleteEventFetcher = useFetcher()
    const [opened, { open, close }] = useDisclosure(false);

    switch(params.data["Status"]) {
        case EventStatus.FAILED:
            return (
                <Flex>
                    <retryEventFetcher.Form method="post">
                        <input type="hidden" name="retryOrderId" value={params.data["Order ID"]} />
                        <Button type="submit" variant="transparent" size="compact-xs">
                            <IconReload />
                        </Button>
                    </retryEventFetcher.Form>
                    <Button mt="xs" variant="transparent" size="compact-xs" onClick={open}>
                        <IconTrash color={"red"}/>
                    </Button>
                    <Modal opened={opened} onClose={close} title="Delete Order">
                        <deleteEventFetcher.Form method="post">
                        <input type="hidden" name="deleteOrderId" value={params.data["Order ID"]} />
                        Confirm deletion of Order ID: {params.data["Order ID"]}
                        <Flex mt="md" justify={"center"}>
                            <Button variant="outline" onClick={close} mx="md">
                                Cancel                            
                            </Button>
                            <Button type="submit" variant="filled" color="red" onClick={open} mx="md">
                                Delete                            
                            </Button>

                        </Flex>
                        </deleteEventFetcher.Form>

                    </Modal>
                </Flex>
            )
        default:
            return (
                <Flex>
                    <deleteEventFetcher.Form method="post">
                    <input type="hidden" name="deleteOrderId" value={params.data["Order ID"]} />
                    <IconTrashFilled color={"red"} type="submit"/>
                    </deleteEventFetcher.Form>
                </Flex>
            )
    }
}