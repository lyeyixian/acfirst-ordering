import { EventType } from '~/common/type'
import { Form, useActionData, useNavigation } from '@remix-run/react'
import { SyntheticEvent, useState } from 'react'
import { Button, Flex, Title } from '@mantine/core'
import { orderAction } from '../application/action.server'

interface InputTarget extends EventTarget {
  name?: string
  value?: string
}

export default function OrderPage() {
  const actionData = useActionData<typeof orderAction>()
  const navigation = useNavigation()

  const [inputs, setInputs] = useState([{ itemCode: '', quantity: '' }])
  const [isDeliveryOrder, setIsDevlieryOrder] = useState(false)

  const handleAddInput = () => {
    setInputs([...inputs, { itemCode: '', quantity: '' }])
  }

  const handleChange = (event: SyntheticEvent, index: number) => {
    const target: InputTarget = event.target
    const { name, value } = target
    const onChangeValue = [...inputs]
    onChangeValue[index][name] = value
    setInputs(onChangeValue)
  }

  const handleDeleteInput = (index: number) => {
    const newArray = [...inputs]
    newArray.splice(index, 1)
    setInputs(newArray)
  }

  return (
    <Form method="post">
      <Title>Create order</Title>
      <input
        type="hidden"
        name="type"
        value={
          isDeliveryOrder
            ? EventType.CREATE_DELIVERY_ORDER
            : EventType.CREATE_INVOICE
        }
      />
      <p>
        <label>
          Doc No:{' '}
          {actionData?.error && actionData.data && (
            <em>{actionData.data.docNo}</em>
          )}
          <input type="text" name="docNo" />
        </label>
      </p>
      {inputs.map((item, index) => (
        <Flex key={index}>
          <label>
            Item Code:{' '}
            {actionData?.error && actionData.data && (
              <em>{actionData.data.itemCodes}</em>
            )}
            <input
              name="itemCode"
              type="text"
              value={item.itemCode}
              onChange={(event) => handleChange(event, index)}
            />
          </label>
          <label>
            Quantity:{' '}
            {actionData?.error && actionData.data && (
              <em>{actionData.data.quantities}</em>
            )}
            <input
              name="quantity"
              type="number"
              value={item.quantity}
              onChange={(event) => handleChange(event, index)}
            />
          </label>
          {inputs.length > 1 && (
            <Button onClick={() => handleDeleteInput(index)}>Delete</Button>
          )}
          {index === inputs.length - 1 && (
            <Button onClick={() => handleAddInput()}>Add</Button>
          )}
        </Flex>
      ))}
      <p>
        <label>
          Delivery Order:
          <input
            type="checkbox"
            name="deliveryOrder"
            onChange={() => setIsDevlieryOrder(!isDeliveryOrder)}
          />
        </label>
      </p>
      <p>
        <button type="submit">
          {navigation.state === 'idle' ? 'Create Order' : 'Creating...'}
        </button>
      </p>
    </Form>
  )
}
