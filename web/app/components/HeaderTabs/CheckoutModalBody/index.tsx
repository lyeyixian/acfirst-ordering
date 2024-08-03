import { Card, Stack, Text } from '@mantine/core'
import { Cart, CartItem } from '~/common/type'
import { UsersTable } from './UsersTable'

export default function CheckoutModalBody({ cart }: { cart: Cart }) {
  return (
    <div>
      {cart.items.map((item: CartItem, index: number) => (
        <Card key={index} p="sm" mt="sm" withBorder>
          <Text size="sm" fw={500}>
            {item.stock.itemCode}
          </Text>
          <Stack>
            <Text size="sm" c="dimmed">
              {`Location: ${item.stock.location}`}
            </Text>
            <Text size="sm" c="dimmed">
              {`Batch: ${item.stock.batch}`}
            </Text>
            <Text size="sm" c="dimmed">
              {`Price per Unit: ${item.stock.pricePerUnit}`}
            </Text>
            <Text size="sm" c="dimmed">
              {`Quantity: ${item.stock.quantity}`}
            </Text>
          </Stack>
        </Card>
      ))}
      <UsersTable />
    </div>
  )
}
