
import { Button, Group, Image, List, Text } from '@mantine/core'
import { Link } from '@remix-run/react'

export function renderErrorDescription(statusCode: number, description: string) {
  switch (statusCode) {
    case 404:
      return 'Page you are trying to open does not exist. You may have mistyped the address, or the page has been moved to another URL. If you think this is an error contact support.'
    case 500:
      return "Our servers could not handle your request. Don't worry, our development team was already notified. Try refreshing the page."
    case 503:
      return 'We cannot handle your request right now, please wait for a couple of minutes and refresh the page. Our team is already working on this issue.'
    default:
      return description || ''
  }
}

export function renderErrorButton(statusCode: number, pathname: string) {
  let buttonText = ''
  let url = ''

  switch (statusCode) {
    case 500:
    case 503:
      buttonText = 'Refresh the page'
      url = pathname
      break
    default:
      buttonText = 'Take me back to home page'
      url = '/'
      break
  }

  return (
    <Button size="md" component={Link} to={url}>
      {buttonText}
    </Button>
  )
}
