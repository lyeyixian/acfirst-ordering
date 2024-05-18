import cx from 'clsx'
import {
  Avatar,
  UnstyledButton,
  Group,
  Text,
  rem,
  Card,
  Popover,
  Divider,
  Button,
  Indicator,
  Box,
  ScrollArea,
} from '@mantine/core'
import { IconLogout, IconChevronDown } from '@tabler/icons-react'
import classes from './HeaderPopover.module.css'
import { useUser } from '~/components/hooks/user'
import { Link } from '@remix-run/react'
import { CartItem } from '~/common/type'
import { useCart } from '~/components/hooks/cart'
import { useState } from 'react'

export default function HeaderPopover() {
  const [userMenuOpened, setUserMenuOpened] = useState(false)
  const { username, email, company } = useUser()
  const { cart } = useCart()

  return (
    <Popover
      position="bottom-end"
      transitionProps={{ transition: 'pop-top-right' }}
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
    >
      <Popover.Target>
        <UnstyledButton
          className={cx(classes.user, {
            [classes.userActive]: userMenuOpened,
          })}
        >
          <Group gap={7}>
            <Indicator color="red" label={cart.items.length} size={16}>
              <Avatar radius="xl" size={30} />
            </Indicator>
            <Text fw={500} size="sm" lh={1} mr={3}>
              {company}
            </Text>
            <IconChevronDown
              style={{ width: rem(12), height: rem(12) }}
              stroke={1.5}
            />
          </Group>
        </UnstyledButton>
      </Popover.Target>

      <Popover.Dropdown>
        <Card shadow="xs">
          <Group gap="xs">
            <Text size="sm" fw={500}>
              {username}
            </Text>
            <Text c="dimmed" size="sm">
              {email}
            </Text>
            <Text c="dimmed" size="sm">
              {company}
            </Text>
          </Group>
        </Card>

        <Divider my="md" />

        <Box>
          {cart.items.length ? (
            <>
              <ScrollArea.Autosize mah={400} offsetScrollbars>
                {cart.items.map((item: CartItem, index: number) => (
                  <Card key={index} p="sm" mt="sm">
                    <Group gap="sm">
                      <Text size="sm" fw={500}>
                        {item.stock.itemCode}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {item.stock.location}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {item.stock.batch}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {item.stock.pricePerUnit}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {item.stock.quantity}
                      </Text>
                    </Group>
                  </Card>
                ))}
              </ScrollArea.Autosize>
              <Button
                fullWidth
                mt="xl"
                component={Link}
                to="/checkout"
                onClick={() => setUserMenuOpened(false)}
              >
                Checkout
              </Button>
            </>
          ) : (
            <>
              <Text ta="center" size="sm" c="dimmed">
                Your cart is empty.
              </Text>
            </>
          )}
        </Box>

        <Divider my="md" />

        <Button
          variant="subtle"
          color="red"
          fullWidth
          component={Link}
          to="/logout"
        >
          <Group gap="xs">
            <IconLogout
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
            <Text size="sm" fw={500}>
              Log Out
            </Text>
          </Group>
        </Button>
      </Popover.Dropdown>
    </Popover>
  )
}
