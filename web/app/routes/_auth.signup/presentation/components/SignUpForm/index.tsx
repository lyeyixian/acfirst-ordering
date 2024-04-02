import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
} from '@mantine/core'
import classes from './SignUpForm.module.css'
import { Link } from '@remix-run/react'
import { useSignUp } from '../../hooks/useSignUp'

export default function SignUpForm() {
  const { handleSubmit, isLoading } = useSignUp()

  return (
    <Container size={420}>
      <Title ta="center" className={classes.title}>
        Sign Up with Acfirst Ordering!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{' '}
        <Anchor size="sm" component={Link} to="/login">
          Sign In
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
        <TextInput label="Company Name" name="company" required mt="md" />
        <TextInput label="Username" name="username" required mt="md" />

        <Button type="submit" fullWidth mt="xl" loading={isLoading}>
          Sign up
        </Button>
      </Paper>
    </Container>
  )
}
