import { Title } from "@mantine/core";
import { redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useTransition } from "react";
import { createPost } from "~/post";

export interface Error {
  title? : boolean | string
  slug? : boolean | string
  body?: boolean | string
}

export let action = async ({ request }: {request: Request}) => {
  let formData = await request.formData();

  let title = formData.get("title");
  let slug = formData.get("slug");
  let body = formData.get("body");

  let errors: Error = {};
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!body) errors.body = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  const post = { title, slug, body };
  await createPost({ request, post });

  return redirect("/admin");
};

export default function NewPost() {
  let errors : Error | undefined = useActionData();
  let transition: any | undefined = useTransition();

  return (
    <Form method="post">
      <Title>Create order</Title>
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
      <p>
        <label>
          Item Code: {errors?.slug && <em>Item Code is required</em>}
          <input type="text" name="itemcode" />
        </label>
      </p>
      <p>
        <label>
          Quantity: {errors?.slug && <em>Quantity is required</em>}
          <input type="text" name="quantity" />
        </label>
      </p>
      <p>
        <button type="submit">
          {transition.submission ? "Creating..." : "Submit Order"}
        </button>
      </p>
    </Form>
  );
}
