import { Outlet, Link, useLoaderData } from "@remix-run/react";
import { getPosts } from "~/post";
import adminStyles from "~/styles/admin.css";

export let links = () => {
  return [{ rel: "stylesheet", href: adminStyles }];
};

export let loader = ({ request }: {request: any}) => {
  return getPosts(request);
};

export default function Admin() {
  let posts = useLoaderData();

  return (
    <div className="admin">
      <nav>
        <h1>Admin</h1>
        <ul>
          {posts.map((post: any) => (
            <li key={post.slug}>
              <Link to={`/posts/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
