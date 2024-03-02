import {
  IconBath,
  IconCar,
  IconSofa,
  IconToolsKitchen2,
} from '@tabler/icons-react'
import HeroBanner from '../components/home/HeroBanner'
import ProductsSection from '../components/home/ProductsSection'
import ShowcaseSection from '../components/home/ShowcaseSection'
import { Button, Group, Image, List, Text } from '@mantine/core'
import { Link } from '@remix-run/react'
import TestimonialsSection from '../components/home/TestimonialsSection'

export function renderSection(section, index) {
  if (!section) {
    return null
  }

  switch (section.type) {
    case 'elements.text':
    case 'hero':
      const { title: heroTitle, description, button, imgUrl } = section

      return (
        <HeroBanner
          key={index}
          title={heroTitle}
          description={description}
          buttonProps={button}
          imgUrl={imgUrl}
        />
      )
    case 'showcase':
      const {
        title: showcaseTitle,
        subtitle: showcaseSubtitle,
        products,
      } = section

      return (
        <ShowcaseSection
          key={index}
          title={showcaseTitle}
          subtitle={showcaseSubtitle}
          products={products}
        />
      )
    case 'product-categories':
      const {
        title: categoriesTitle,
        subtitle: categoriesSubtitle,
        categories,
      } = section

      return (
        <ProductsSection
          key={index}
          title={categoriesTitle}
          subtitle={categoriesSubtitle}
          categories={categories}
        />
      )
    case 'testimonials':
      const { reviews } = section

      return <TestimonialsSection key={index} reviews={reviews} />
    default:
      return null
  }
}

export function renderCategoryIcon(category) {
  if (!category) {
    return null
  }

  switch (category.slug) {
    case 'kitchen':
      return IconToolsKitchen2
    case 'bathroom':
      return IconBath
    case 'living-room':
      return IconSofa
    case 'car-poch':
      return IconCar
    default:
      return null
  }
}

export function renderErrorDescription(statusCode, description) {
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

export function renderErrorButton(statusCode, pathname) {
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
