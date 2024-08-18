import { Badge, Table, Group, Text, ActionIcon, rem } from '@mantine/core'
import { IconPencil, IconTrash } from '@tabler/icons-react'
import { CartItem } from '~/common/type'

export function CheckoutTable({ cartItems }: { cartItems: CartItem[] }) {
  console.log('DEBUG cartItems:', cartItems)
  const rows = cartItems.map((item) => (
    <Table.Tr key={item.stock.itemCode}>
      <Table.Td>
        <Group gap="sm">
          <Text fz="sm" fw={500}>
            {item.stock.itemCode}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Badge variant="light">{item.stock.location}</Badge>
      </Table.Td>

      <Table.Td>
        {item.stock.batch ? (
          <Badge variant="light">{item.stock.batch}</Badge>
        ) : null}
      </Table.Td>

      <Table.Td>
        <Text fz="sm">{`RM ${item.stock.pricePerUnit}`}</Text>
      </Table.Td>

      <Table.Td>{item.currentQuantity}</Table.Td>
      <Table.Td>{item.stock.quantity}</Table.Td>

      <Table.Td>
        <Group gap={0} justify="flex-end">
          <ActionIcon variant="subtle" color="gray">
            <IconPencil
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red">
            <IconTrash
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <Table.ScrollContainer minWidth={800}>
      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Code</Table.Th>
            <Table.Th>Location</Table.Th>
            <Table.Th>Batch</Table.Th>
            <Table.Th>Price Per Unit</Table.Th>
            <Table.Th>Quantity</Table.Th>
            <Table.Th>Current Stock Amount</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
