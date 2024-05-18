import { Group, Image, Container } from '@mantine/core'
import { Link } from '@remix-run/react'
import HeaderPopover from './HeaderPopover'
import { useCart } from '../hooks/cart'

export default function HeaderTabs() {
  const { shouldRender } = useCart()

  return (
    <Container>
      <Group h="100%" justify="space-between">
        <Link to="/">
          <Image w={60} src="/nav-logo.svg" />
        </Link>

        {shouldRender ? <HeaderPopover /> : null}
      </Group>
    </Container>
  )
}
