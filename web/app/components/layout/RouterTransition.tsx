import { NavigationProgress, nprogress } from '@mantine/nprogress'
import { useNavigation } from '@remix-run/react'
import { useEffect } from 'react'

export default function RouterTransition() {
  const navigation = useNavigation()

  useEffect(() => {
    if (navigation.state === 'loading') {
      nprogress.start()
    } else if (navigation.state === 'idle') {
      nprogress.complete()
    }
  }, [navigation.state])

  return <NavigationProgress autoReset={true} />
}
