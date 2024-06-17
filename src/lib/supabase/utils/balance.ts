import { createClient } from "../server";

export type TChangedBalance = {
  oldBalance: number;
  newBalance: number;
  difference: number;
};

/**
 * This function updates the user's balance in the "profile" table in Supabase.
 * It first selects the user's profile from the table, then updates the balance
 * based on the 'type' parameter (either increment or decrement), and finally
 * returns the old balance, new balance, and the difference between them.
 *
 * @param {string} userId - the ID of the user whose balance will be updated.
 * @param {number} amount - the amount by which the balance will be increased
 * or decreased.
 * @param {"increment" | "decrement"} type - either "increment" or "decrement".
 *
 * @returns {Promise<TChangedBalance>} - a Promise that resolves to an object
 * with the old balance, new balance, and the difference between them.
 *
 * @throws {Error} - if there is an error selecting or updating the profile.
 */
export async function handleBalance(
  type: "increment" | "decrement",
  userId: string,
  amount: number
) {
  const supabase = createClient();

  // Select the user's profile from the "profile" table
  const { data: profile, error: profileSelectError } = await supabase
    .from("profile")
    .select()
    .eq("user_id", userId)
    .single();

  // If there was an error selecting the profile, throw an error
  if (profileSelectError)
    throw { type: "profile-select", error: profileSelectError };

  // Update the balance based on the 'type' parameter and the 'amount' parameter
  const newBalance =
    type === "increment" ? profile.balance + amount : profile.balance - amount;

  // Update the user's profile in the "profile" table with the new balance
  const { error: profileUpdateError } = await supabase
    .from("profile")
    .update({
      balance: newBalance,
    })
    .eq("user_id", userId);

  // If there was an error updating the profile, throw an error
  if (profileUpdateError)
    throw { type: "profile-update", error: profileUpdateError };

  // Return the old balance, new balance, and the difference between them
  return {
    oldBalance: profile.balance,
    newBalance,
    difference: newBalance - profile.balance,
  } as TChangedBalance;
}
