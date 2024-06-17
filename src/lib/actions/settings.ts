"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "../supabase/server";
import { Database } from "../types/supabase";

type TSettings = Database["public"]["Tables"]["settings"]["Row"];
/**
 * This function updates the user's settings in the "settings" table in the
 * Supabase database. It first gets the user's ID from the Supabase session and
 * then uses this ID to update the user's settings in the "settings" table. If
 * there is an error updating the settings, it throws an error. After updating
 * the settings, it revalidates the "/home"
 * path so that the page is updated in the browser's cache.
 *
 * @param {Partial<TSettings>} data - an object containing the new settings
 * data to update in the database
 * @returns {Promise<void>} - a Promise that resolves when the update is complete
 * @throws {Error} - if there is an error updating the settings
 */
export async function updateSettings(data: Partial<TSettings>) {
  // Create a new client to interact with the database
  const supabase = createClient();

  // Get the user's ID from the Supabase session
  const userId = (await supabase.auth.getUser()).data.user?.id;

  // If there is no user ID, throw an error
  if (!userId) throw Error("No user ID");

  // Update the user's settings in the "settings" table
  const { data: res, error } = await supabase
    .from("settings")
    .update({ ...data })
    .eq("user_id", userId);

  // If there is an error updating the settings, throw an error
  if (error) throw { type: "settings-update", ...error };

  // Revalidate the "/home" path so that the page is updated in the browser's cache
  revalidatePath("/home");

  return;
}
