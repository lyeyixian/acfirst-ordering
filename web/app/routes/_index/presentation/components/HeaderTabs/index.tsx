import cx from 'clsx'
import { useState } from 'react'
import {
  Avatar,
  UnstyledButton,
  Group,
  Text,
  rem,
  Image,
  Container,
  Card,
  Popover,
  Divider,
  Button,
} from '@mantine/core'
import { IconLogout, IconChevronDown } from '@tabler/icons-react'
import classes from './HeaderTabs.module.css'
import { useUser } from '~/components/hooks/user'
import { Link } from '@remix-run/react'

export default function HeaderTabs() {
  const [userMenuOpened, setUserMenuOpened] = useState(false)
  const { username, email, company } = useUser()

  return (
    <Container>
      <Group h="100%" justify="space-between">
        <Link to="/">
          <Image w={60} src="/nav-logo.svg" />
        </Link>

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
                <Avatar radius="xl" size={30} />
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
      </Group>
    </Container>
  )
}
