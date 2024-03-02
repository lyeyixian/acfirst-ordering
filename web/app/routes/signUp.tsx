import { Form, Link } from "@remix-run/react";

import { signUp } from "~/utils/db.server";
import { createUserSession } from "~/utils/session.server";

export let action = async ({ request } : {request: Request}) => {
  let formData = await request.formData();

  let email : any = formData.get("email");
  let password : any = formData.get("password");

  const { user } = await signUp(email, password);
  const token = await user.getIdToken();
  return createUserSession(token, "/posts");
};

export default function SignUp() {
  return (
    <div className="signup">
      <h1>Sign Up Page</h1>

      <Form method="post">
        <p>
          <label>
            Email
            <input type="email" name="email" />
          </label>
        </p>
        <p>
          <label>
            Password
            <input type="password" name="password" />
          </label>
        </p>

        <button type="submit">Sign Up</button>
      </Form>

      <Link to="/login">Go to Login</Link>
    </div>
  );
}
