import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  rem,
  Image,
  Paper,
  Transition,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { NavLink } from '@remix-run/react'
import ShoppingCart from './ShoppingCart'

const HEADER_HEIGHT = rem(60)

const useStyles = createStyles((theme) => ({
  inner: {
    height: HEADER_HEIGHT,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    right: 0,
    left: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[1],
    },

    [theme.fn.smallerThan('sm')]: {
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.md,
      paddingLeft: theme.spacing.lg,
    },
  },

  linkLabel: {
    marginRight: rem(5),
  },

  linkActive: {
    backgroundColor: theme.colors[theme.primaryColor][1],

    '&:hover': {
      backgroundColor: theme.colors[theme.primaryColor][2],
    },
  },
}))

const links = [
  {
    link: '/',
    label: 'Home',
  },
  {
    link: '/about',
    label: 'About',
  },
  {
    link: '/products',
    label: 'Products',
  },
  {
    link: '/projects',
    label: 'Projects',
  },
  {
    link: '/stores',
    label: 'Locate Us',
  },
  {
    link: '/contact',
    label: 'Contact Us',
  },
]

export default function Navbar() {
  const { classes, cx } = useStyles()
  const [opened, { toggle }] = useDisclosure(false)
  const items = links.map((link) => {
    return (
      <NavLink
        key={link.label}
        to={link.link}
        className={({ isActive }) =>
          cx(classes.link, { [classes.linkActive]: isActive })
        }
        onClick={() => toggle(false)}
      >
        {link.label}
      </NavLink>
    )
  })

  return (
    <Header height={HEADER_HEIGHT} sx={{ borderBottom: 0 }} mb={120}>
      <Container className={classes.inner}>
        <Group>
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
          />
          <NavLink to="/">
            <Image width={70} src="/nav-logo.svg" />
          </NavLink>
        </Group>

        <Group spacing={5} className={classes.links}>
          {items}
        </Group>

        <ShoppingCart />

        <Transition transition="pop-top-left" duration={200} mounted={opened}>
          {(styles) => (
            <Paper withBorder style={styles} className={classes.dropdown}>
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  )
}
