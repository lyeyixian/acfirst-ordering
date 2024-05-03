import cx from 'clsx'
import { useState } from 'react'
import {
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  rem,
  Image,
  Container,
} from '@mantine/core'
import { IconLogout, IconChevronDown } from '@tabler/icons-react'
import classes from './HeaderTabs.module.css'
import { useUser } from '~/components/hooks/user'
import UserInfo from '../UserInfo'
import { Link } from '@remix-run/react'

export default function HeaderTabs() {
  const [userMenuOpened, setUserMenuOpened] = useState(false)
  const { company } = useUser()

  return (
    <Container>
      <Group h="100%" justify="space-between">
        <Link to="/">
          <Image w={60} src="/nav-logo.svg" />
        </Link>

        <Menu
          position="bottom-end"
          transitionProps={{ transition: 'pop-top-right' }}
          onClose={() => setUserMenuOpened(false)}
          onOpen={() => setUserMenuOpened(true)}
          withinPortal
        >
          <Menu.Target>
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
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item component={UserInfo}></Menu.Item>

            <Menu.Divider />

            <Menu.Item
              color="red"
              leftSection={
                <IconLogout
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                />
              }
              component={Link}
              to="/logout"
            >
              Log Out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Container>
  )
}
