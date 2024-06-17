"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "../supabase/server";

/**
 * This function is used to handle the GitHub OAuth sign-in process.
 * When a user clicks on the GitHub sign-in button on our website,
 * we send a POST request to the Supabase Authentication API
 * to initiate the OAuth flow with GitHub.
 *
 * First, we get the origin of the request to use as the redirect URL
 * after the user authenticates with GitHub. We use the `headers` object
 * from Next.js to get the `origin` header.
 *
 * Then, we create a new Supabase client using `createClient()`.
 *
 * Next, we call `signInWithOAuth()` on the `supabase.auth` object,
 * passing in an options object with the following properties:
 * - `provider`: The OAuth provider we want to use, in this case `github`.
 * - `options`: An object containing the configuration for the OAuth flow.
 *   - `scopes`: An array of strings representing the scopes we want to request
 *     from the OAuth provider. In this case, we're requesting read access to the user.
 *   - `redirectTo`: The URL to redirect the user to after they authenticate with the
 *     OAuth provider. We construct this URL by concatenating the `origin` header with
 *     `/auth/callback`.
 *
 * If there's an error during the OAuth flow, we redirect the user back to the login page
 * with a query parameter `message` set to "Could not authenticate user".
 *
 * If the OAuth flow is successful, we redirect the user to the URL returned by Supabase
 * in the `data.url` property of the response object.
 *
 * @returns {Promise<string>} A promise that resolves to the URL to redirect the user to after they authenticate with GitHub.
 */
export async function signIn() {
  // Get the origin of the request
  const origin = headers().get("origin") as string;

  // Create a new Supabase client
  const supabase = createClient();

  // Initiate the GitHub OAuth flow with Supabase
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      scopes: "read:user",
      redirectTo: `${origin}/auth/callback`,
    },
  });

  // If there's an error during the OAuth flow, redirect the user back to the login page
  if (error) {
    return redirect("/login?message=Could not authenticate user");
  }

  // If the OAuth flow is successful, redirect the user to the URL returned by Supabase
  return redirect(data.url);
}

/**
 * This function is used to handle the sign-out process for the user.
 * When the user clicks the sign-out button on the page, we send a POST request
 * to the Supabase Authentication API to sign the user out of their session.
 *
 * First, we create a new Supabase client using `createClient()`.
 *
 * Then, we call `signOut()` on the `supabase.auth` object to initiate the sign-out process.
 *
 * After the user is signed out, we redirect the user back to the login page
 * with a query parameter `message` set to "Successfully signed out".
 *
 * @returns {Promise<void>} A promise that resolves after the user is successfully signed out.
 */
export async function signOut() {
  // Create a new Supabase client
  const supabase = createClient();

  // Initiate the sign-out process with Supabase
  await supabase.auth.signOut();

  // After the user is signed out, redirect the user back to the login page
  return redirect("/login?message=Successfully signed out");
}
