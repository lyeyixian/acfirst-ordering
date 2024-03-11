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
      <p>
        <label>
          Post Title: {errors?.title && <em>Title is required</em>}
          <input type="text" name="title" />
        </label>
      </p>
      <p>
        <label>
          Post Slug: {errors?.slug && <em>Slug is required</em>}
          <input type="text" name="slug" />
        </label>
      </p>
      <p>
        <label htmlFor="body">Body</label>{" "}
        {errors?.body && <em>Body is required</em>}
        <br />
        <textarea rows={20} name="body" />
      </p>
      <p>
        <button type="submit">
          {transition.submission ? "Creating..." : "Create Post"}
        </button>
      </p>
    </Form>
  );
}
