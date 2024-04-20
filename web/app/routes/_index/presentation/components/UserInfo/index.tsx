import { Group, Text, Card } from '@mantine/core'
import classes from './UserInfo.module.css'
import { useUser } from '~/components/hooks/user'
import { ComponentPropsWithoutRef } from 'react'

export default function UserInfo(props: ComponentPropsWithoutRef<typeof Card>) {
  const { username, email, company } = useUser()

  return (
    <Card className={classes.user} {...props}>
      <Group>
        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {username}
          </Text>

          <Text c="dimmed" size="sm">
            {email}
          </Text>
          <Text c="dimmed" size="sm">
            {company}
          </Text>
        </div>
      </Group>
    </Card>
  )
}
