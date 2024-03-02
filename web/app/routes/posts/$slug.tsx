import { getPost } from "~/post";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";

const parseBody = (str: string) => {
  return str.replace(/\n/g, "<br />");
};

export let loader = async ({ params, request }: {params: any, request: Request}) => {
  invariant(params.slug, "expected params.slug");

  return getPost({ request, slug: params.slug });
};

export default function PostSlug() {
  let post = useLoaderData();
  return (
    <div>
      <h2>{post.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: parseBody(post.body) }} />
    </div>
  );
}
