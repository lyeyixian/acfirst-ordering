import {
  createStyles,
  Text,
  Container,
  ActionIcon,
  Group,
  rem,
  Stack,
  ThemeIcon,
} from '@mantine/core'
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconClock,
  IconMail,
  IconMap,
  IconPhone,
} from '@tabler/icons-react'
import { MantineLogo } from '@mantine/ds'
import { Link } from '@remix-run/react'

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: rem(120),
    paddingTop: `calc(${theme.spacing.xl} * 2)`,
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  logo: {
    maxWidth: rem(250),
    marginLeft: theme.spacing.md,

    [theme.fn.smallerThan('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  },

  description: {
    marginTop: rem(5),
    maxWidth: rem(210),

    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.xs,
      textAlign: 'left',
    },
  },

  inner: {
    display: 'flex',
    justifyContent: 'space-between',

    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },

  groups: {
    display: 'flex',
    flexWrap: 'wrap',

    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  wrapper: {
    width: rem(160),
  },

  link: {
    display: 'block',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[1]
        : theme.colors.gray[6],
    fontSize: theme.fontSizes.sm,
    paddingTop: rem(3),
    paddingBottom: rem(3),
    textDecoration: 'none',

    '&:hover': {
      textDecoration: 'underline',
    },
  },

  title: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 700,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    marginBottom: `calc(${theme.spacing.xs} / 2)`,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
  },

  afterFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,

    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column',
    },
  },

  social: {
    marginRight: theme.spacing.md,

    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.xs,
    },
  },

  socialIcon: {
    '&:hover': {
      color: theme.colors.dark[3],
    },
  },

  copyright: {
    marginLeft: theme.spacing.md,
  },
}))

const groupsData = [
  {
    title: 'Categories',
    links: [
      { label: 'Kitchen', link: '/products/kitchen' },
      { label: 'Bathroom', link: '/products/bathroom' },
      { label: 'Living Room', link: '/products/living' },
      { label: 'Car Poch', link: '/products/car' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', link: '/about' },
      { label: 'Projects', link: '/projects' },
      { label: 'Locate Us', link: '/stores' },
      { label: 'Contact', link: '/contact' },
    ],
  },
]
const infosData = [
  {
    description:
      'Lot 411, Jalan Kelubi, Kampung Kelubi Luar, 06000 Jitra, Kedah, Malaysia',
    icon: IconMap,
  },
  { description: '04-917 8928', icon: IconPhone },
  { description: 'acfirst55@gmail.com', icon: IconMail },
  { description: '9am to 6:30pm everyday except Friday', icon: IconClock },
]

export default function Footer() {
  const { classes } = useStyles()

  const groups = groupsData.map((group) => {
    const links = group.links.map((link, index) => (
      <Link key={index} className={classes.link} to={link.link}>
        {link.label}
      </Link>
    ))

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    )
  })
  const infos = infosData.map((info, index) => {
    return (
      <Group key={index} align="center">
        <ThemeIcon variant="light" color="gray" size="sm">
          <info.icon size="1.25rem" stroke={1.5} />
        </ThemeIcon>
        <Text size="xs" color="dimmed" className={classes.description}>
          {info.description}
        </Text>
      </Group>
    )
  })

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
          <MantineLogo size={30} />
          <Stack spacing={4}>{infos}</Stack>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text className={classes.copyright} color="dimmed" size="sm">
          © 2023 Acfirst Ceramics Sdn. Bhd. All rights reserved.
        </Text>

        <Group spacing={0} className={classes.social} position="right" noWrap>
          <ActionIcon
            className={classes.socialIcon}
            size="lg"
            component="a"
            href="https://www.facebook.com/acfirstceramics"
            target="_blank"
            rel="noreferrer noopener"
          >
            <IconBrandFacebook size="1.05rem" stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            className={classes.socialIcon}
            size="lg"
            component="a"
            href="https://instagram.com/acfirst_changlun?igshid=YmMyMTA2M2Y="
            target="_blank"
            rel="noreferrer noopener"
          >
            <IconBrandInstagram size="1.05rem" stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            className={classes.socialIcon}
            size="lg"
            component="a"
            href="https://wa.me/60174051255"
            target="_blank"
            rel="noreferrer noopener"
          >
            <IconBrandWhatsapp size="1.05rem" stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  )
}
