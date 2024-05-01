import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Select,
} from '@mantine/core'
import classes from './SignUpForm.module.css'
import { Link } from '@remix-run/react'
import { useSignUp } from '../../hooks/useSignUp'
import { BRANCH_NAME_TO_CODE } from '~/common/constants'

// TODO: add validation and error from Mantine useForm hook
export default function SignUpForm() {
  const { handleSubmit, isLoading } = useSignUp()

  return (
    <Container size={420}>
      <Title ta="center" className={classes.title}>
        Create your account
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
        <TextInput label="Username" name="username" required mt="md" />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          name="password"
          required
          mt="md"
        />
        <Select
          mt="md"
          required
          label="Branch Name"
          placeholder="Branch"
          name="company"
          data={[...Object.keys(BRANCH_NAME_TO_CODE)]}
        />        

        <Button type="submit" fullWidth mt="xl" loading={isLoading}>
          Sign up
        </Button>
      </Paper>
    </Container>
  )
}
