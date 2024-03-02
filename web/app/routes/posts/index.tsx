
import { Link, useLoaderData } from "@remix-run/react";
import { getPosts } from "~/post";

export let loader = ({ request }: {request : Request}) => {
  return getPosts(request);
};

export default function Posts() {
  let posts : any= useLoaderData();

  return (
    <div>
      <h1>Posts</h1>

      <ul>
        {posts.map((post: any) => (
          <li key={post.slug}>
            <Link to={post.slug}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
