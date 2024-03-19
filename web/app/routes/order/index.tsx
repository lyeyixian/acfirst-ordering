import { Button, Flex, Title } from "@mantine/core";
import { redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useState, useTransition } from "react";
import { getUserSessionEmail } from "~/utils/session.server";
import { createEvent, getUser } from "~/utils/db.server";


export interface Error {
  title? : boolean | string
  slug? : boolean | string
  body?: boolean | string
}

export let action = async ({ request }: {request: Request}) => {
  const userEmail = await getUserSessionEmail(request);
  const user = await getUser(userEmail);
  if (!user.exists || user.data() === null || user.data() === undefined) {
    throw new Error('Missing user information!')
  }


  let formData = await request.formData();
  const docNo = formData.get("docNo");
  const code = formData.get("code");
  const description = formData.get("description");
  const itemCodes = formData.getAll("itemCode");
  const quantites = formData.getAll("quantity");

  let errors: any = {};
  if (!docNo) errors.docNo = true;
  if (!code) errors.code = true;
  if (!itemCodes || itemCodes.length === 0) errors.itemCodes = true;
  if (!quantites || quantites.length === 0) errors.quantites = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  const data : any[] = [];
  itemCodes.forEach((itemCode, i) => data.push({"ItemCode": itemCode, "Qty": quantites[i]}));

  const payload = {
    "DocNo": docNo,
    "Code": code,
    "Description": description,
    "Data": data
  }

  const requestBody = {
    "id": user.data().userId,
    "name": formData.get('event'),
    "payload": payload,
    "status": "queued",
    "createdBy": user.data().username,
    "createdAt": Date.now(),
    "updatedAt": Date.now()
  }

  await createEvent(requestBody);

  return redirect("/");
};

export default function SalesInvoice() {
  let errors : Error | undefined = useActionData();
  let transition: any | undefined = useTransition();

  const [inputs, setInputs] = useState([{ itemCode: "", quantity: "" }]);
  const [isDeliveryOrder, setIsDevlieryOrder] = useState(false);

  const handleAddInput = () => {
    setInputs([...inputs, { itemCode: "", quantity: "" }]);
  };

  const handleChange = (event: any, index: number) => {
    let { name, value } = event.target;
    let onChangeValue: any = [...inputs];
    onChangeValue[index][name] = value;
    setInputs(onChangeValue);
  };

  const handleDeleteInput = (index: number) => {
    const newArray = [...inputs];
    newArray.splice(index, 1);
    setInputs(newArray);
  };



  return (
    <Form method="post">
      <Title>Create order</Title>
      <input type="hidden" name="event" value={isDeliveryOrder ? "deliveryOrder" : "salesInvoice"}/>
      <p>
        <label>
          Doc No: {errors?.title && <em>Document Number is required</em>}
          <input type="text" name="docNo" />
        </label>
      </p>
      <p>
        <label>
          Code: {errors?.slug && <em>Code is required</em>}
          <input type="text" name="code" />
        </label>
      </p>
      <p>
        <label>
          Description:
          <input type="text" name="description" />
        </label>
      </p>
      {inputs.map((item, index) => (
        <Flex key={index}>
          <label>
            Item Code: {errors?.slug && <em>Item Code is required</em>}
            <input
              name="itemCode"
              type="text"
              value={item.itemCode}
              onChange={(event) => handleChange(event, index)}
            />
          </label>
          <label>
            Quantity: {errors?.slug && <em>Quantity is required</em>}
            <input
              name="quantity"
              type="text"
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
          <input type="checkbox" name="deliveryOrder" onChange={() => setIsDevlieryOrder(!isDeliveryOrder)}/>
        </label>
      </p>
      <p>
        <button type="submit">
          {transition.submission ? "Creating..." : "Create Order"}
        </button>
      </p>
    </Form>
  );
}
