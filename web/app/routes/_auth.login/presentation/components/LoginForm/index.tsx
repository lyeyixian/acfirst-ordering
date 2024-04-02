import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from '@mantine/core'
import classes from './LoginForm.module.css'
import { Link } from '@remix-run/react'
import { useLogin } from '../../hooks/useLogin'

export default function LoginForm() {
  const { handleSubmit, isLoading } = useLogin()

  return (
    <Container size={420}>
      <Title ta="center" className={classes.title}>
        Sign in to your account
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor size="sm" component={Link} to="/signup">
          Create account
        </Anchor>
      </Text>

      <Paper
        withBorder
        shadow="md"
        p={30}
        mt={30}
        radius="md"
        component="form"
        onSubmit={handleSubmit}
      >
        <TextInput
          label="Email"
          placeholder="acfirst@gmail.com"
          name="email"
          required
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          name="password"
          required
          mt="md"
        />
        <Group justify="space-between" mt="lg">
          {/* TODO: research how to destroy cookie when close tab and keep cookie when refresh */}
          <Checkbox label="Remember me" name="remember" />
          <Anchor size="sm" component={Link} to="/forget">
            Forgot password?
          </Anchor>
        </Group>
        <Button type="submit" fullWidth mt="xl" loading={isLoading}>
          Sign in
        </Button>
      </Paper>
    </Container>
  )
}
