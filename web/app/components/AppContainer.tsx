import { AppShell, Container } from '@mantine/core'
import { useLocation } from '@remix-run/react'
import RouterTransition from './RouterTransition'
import { useDisclosure } from '@mantine/hooks'
import { Navbar } from './Navbar/Navbar'

export default function AppContainer({ children }: { children : React.ReactElement}) {
  const location = useLocation()
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell padding={0} navbar={{
      width: 300,
      breakpoint: 'sm',
      collapsed: { mobile: !opened },
    }}>
      {/* <AppShell.Navbar p="md">
        <Navbar/>
      </AppShell.Navbar> */}

      <AppShell.Main>      
        <RouterTransition />
          {location.pathname === '/' ? children : <Container>{children}</Container>}
        </AppShell.Main>
    </AppShell>
  )
}
