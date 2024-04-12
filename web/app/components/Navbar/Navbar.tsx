import { Group, rem, Image, Flex, Title, Box, ThemeIcon } from '@mantine/core';
import {
  IconLogout,
} from '@tabler/icons-react';
import  Logo  from "./logo.png"
import classes from './Navbar.module.css';
import { UserInfo } from './UserInfo';
import { NavLink } from '@remix-run/react';

export function Navbar() {

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
        <NavLink to="/logout">
          <Group justify="space-between" pl={10} pt={10}>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <ThemeIcon variant="light" size={30}>
                <IconLogout style={{ width: rem(18), height: rem(18) }} />
              </ThemeIcon>
              <Box ml="md">Log Out</Box>
            </Box>
          </Group>
        </NavLink>
      </div>

    </nav>
  );
}