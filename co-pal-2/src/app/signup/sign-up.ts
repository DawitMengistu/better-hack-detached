import { authClient } from "@/lib/auth-client"; //import the auth client

// Example usage of the auth client
export async function signUpUser(
  email: string,
  password: string,
  name: string
) {
  const { data, error } = await authClient.signUp.email({
    email, // user email address
    password, // user password -> min 8 characters by default
    name, // user display name
    callbackURL: "/feed", // A URL to redirect to after the user verifies their email (optional)
  });

  return { data, error };
}
