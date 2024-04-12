import { Group, rem, Image, Flex, Title, Box, ThemeIcon } from '@mantine/core';
import {
  IconHome,
  IconLogout,
  IconShoppingCart,
} from '@tabler/icons-react';
import  Logo  from "./logo.png"
import classes from './Navbar.module.css';
import { UserInfo } from './UserInfo';
import { NavLink } from '@remix-run/react';

export function Navbar() {
  const links = [
    {
      link: "/",
      icon: <IconHome style={{ width: rem(18), height: rem(18) }}/>,
      text: "Home"
    },

    {
      link: "/order",
      icon: <IconShoppingCart style={{ width: rem(18), height: rem(18) }}/>,
      text: "Order"
    },
    {
      link: "/logout",
      icon: <IconLogout style={{ width: rem(18), height: rem(18) }} />,
      text: "Log Out"
    }
  ]
  
  const menuItems =links.map((link) => {
    return (
      <NavLink to={link.link} key={link.link}>
      <Group justify="space-between" pl={10} pt={10}>
        <Box style={{ display: 'flex', alignItems: 'center' }}>
          <ThemeIcon variant="light" size={30}>
            {link.icon}
          </ThemeIcon>
          <Box ml="md">{link.text}</Box>
        </Box>
      </Group>
    </NavLink>
    )
  })

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Flex justify="space-between">
          <Image 
              src={Logo}       
              radius="md"
              h={80}
              w="auto"
              fit="contain"
          /> 
          <Title order={3} mt={20}>ACFirst Ordering</Title>
        </Flex>
      </div>

      <div className={classes.linksInner}>
        <UserInfo/>
        {menuItems}
      </div>

    </nav>
  );
}