import { createStyles, Title, Text, Group, rem } from '@mantine/core'
import { useLocation } from '@remix-run/react'
import { renderErrorButton, renderErrorDescription } from '../utils/renderer'

const useStyles = createStyles((theme: any) => ({
  root: {
    paddingTop: rem(80),
    paddingBottom: rem(80),
  },

  label: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: rem(220),
    lineHeight: 1,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[4]
        : theme.colors.gray[2],

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(120),
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: 'center',
    fontWeight: 900,
    fontSize: rem(38),

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(32),
    },
  },

  description: {
    maxWidth: rem(500),
    margin: 'auto',
    marginTop: theme.spacing.xl,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
  },
}))

export default function GracefulError({
  status,
  statusText,
  statusDescription,
}: {status: any, statusText: string, statusDescription: string}) {
  const { classes } = useStyles()
  const location = useLocation()

  return (
    <div className={classes.root}>
      <div className={classes.label}>{status}</div>
      <Title className={classes.title}>{statusText}</Title>
      <Text
        color="dimmed"
        size="lg"
        align="center"
        className={classes.description}
      >
        {renderErrorDescription(status, statusDescription)}
      </Text>
      <Group position="center">
        {renderErrorButton(status, location.pathname)}
      </Group>
    </div>
  )
}
