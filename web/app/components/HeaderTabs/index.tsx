import { Group, Image, Container } from '@mantine/core'
import { Link } from '@remix-run/react'
import { useAuth } from '../hooks/auth'
import HeaderPopover from './HeaderPopover'

export default function HeaderTabs() {
  const { isAuthRoute } = useAuth()

  return (
    <Container>
      <Group h="100%" justify="space-between">
        <Link to="/">
          <Image w={60} src="/nav-logo.svg" />
        </Link>

        {isAuthRoute ? null : <HeaderPopover />}
      </Group>
    </Container>
  )
}
