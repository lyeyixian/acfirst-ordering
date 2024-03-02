import { AppShell, Container } from '@mantine/core'
import Navbar from './Navbar'
import Footer from './Footer'
import { useLocation } from '@remix-run/react'
import RouterTransition from './RouterTransition'

export default function AppContainer({ children }: {children:any}) {
  const location = useLocation()

  return (
    <AppShell padding={0} header={<Navbar />} footer={<Footer />}>

      <RouterTransition />
      {location.pathname === '/' ? children : <Container>{children}</Container>}
    </AppShell>
  )
}
