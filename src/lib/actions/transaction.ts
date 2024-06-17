"use server";

import { revalidatePath } from "next/cache";
import { v4 as uuid } from "uuid";

import { TTransactionForm } from "@/components/transaction/form-schema";

import { createClient } from "../supabase/server";
import { handleBalance } from "../supabase/utils/balance";
import { TTransaction } from "../supabase/utils/other";
import { updateSummary } from "../supabase/utils/summary";
import { TTransactionTypes } from "../types";

/**
 * This function is used to insert a new transaction into the database
 * It also updates the summary of the user's balance and updates the cache
 * @param data The data of the new transaction
 * @throws {Error} If there is no user ID
 * @throws {{type: string, ...error}} If there is an error inserting the transaction
 */
export async function newTransaction(data: TTransactionForm) {
  // Create a new client to interact with the database
  const supabase = createClient();

  // Get the user ID from the supabase session
  const userId = (await supabase.auth.getUser()).data.user?.id;

  // If there is no user ID, throw an error
  if (!userId) throw Error("No user ID");

  // Generate a new transaction ID
  const transactionId = uuid();

  // Insert the new transaction into the database
  const { error } = await supabase.from("transactions").insert({
    user_id: userId,
    transaction_id: transactionId,
    transaction_type: data.transaction_type,
    transaction_date: data.transaction_date.toUTCString(),
    amount: data.amount,
    title: data.title,
    description: data.description,
    categories: data.categories,
    created_at: new Date().toUTCString(),
    updated_at: new Date().toUTCString(),
  });

  // If there was an error inserting the transaction, throw an error
  if (error) throw { type: "transaction-insert", ...error };

  // Revalidate the path to trigger a cache update
  revalidatePath("/home");

  // Calculate the change in balance for the user
  const changedBalance = await handleBalance(
    data.transaction_type === "income" ? "increment" : "decrement",
    userId,
    data.amount
  );

  // Update the summary of the user's balance with the new transaction
  await updateSummary({
    action: "create",
    userId,
    changedBalance,
    currentTransaction: {
      amount: data.amount,
      transaction_type: data.transaction_type,
      transaction_date: data.transaction_date.toUTCString(),
    },
  });

  // Return nothing
  return;
}

/**
 * This function updates an existing transaction in the database with new data.
 * If the transaction type has changed, it treats the difference in amount as a
 * separate transaction for the purposes of updating the balance and summary.
 * @param {string} transactionId - the ID of the transaction to update
 * @param {TTransactionForm} oldData - the old data for the transaction
 * @param {Partial<TTransactionForm>} newData - the new data for the transaction
 * @throws {Error} if there is no user ID
 * @throws {{type: string, ...error}} if there is an error updating the transaction
 */
export async function updateTransaction(
  transactionId: string,
  oldData: TTransactionForm,
  newData: Partial<TTransactionForm>
) {
  const supabase = createClient();

  const userId = (await supabase.auth.getUser()).data.user?.id;

  if (!userId) throw Error("No user ID");

  /* transaction is the same as newData */
  const { data: transaction, error } = await supabase
    .from("transactions")
    .update({
      ...newData,
      updated_at: new Date().toUTCString(),
    } as Partial<TTransaction>)
    .eq("transaction_id", transactionId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw { type: "transaction-update", ...error };

  // Revalidate the path to trigger a cache update
  revalidatePath("/home");

  // Get the old and new transaction types
  const transactionType = transaction.transaction_type;
  const oldTransactionType = oldData.transaction_type;

  // Check if the transaction type has changed
  const typeChanged = transactionType !== oldTransactionType;

  // If the transaction type has changed, calculate the difference in amount
  // as a separate transaction for the purposes of updating the balance and summary
  let incrementOrDecrement: "increment" | "decrement";
  let difference: number;

  if (typeChanged) {
    // If the transaction type has changed, treat the whole amount as a difference
    difference = oldData.amount + transaction.amount;
    incrementOrDecrement =
      transactionType === "income" ? "increment" : "decrement";
  } else {
    // If the transaction type has not changed, calculate the difference in amount
    difference = oldData.amount - transaction.amount;
    incrementOrDecrement =
      transactionType === "income"
        ? difference < 0
          ? "increment"
          : "decrement"
        : difference > 0
          ? "increment"
          : "decrement";
  }

  // Update the user's balance based on the changed transaction
  const changedBalance = await handleBalance(
    incrementOrDecrement,
    userId,
    Math.abs(difference)
  );

  // Update the summary of the user's balance with the new transaction and the old transaction
  await updateSummary({
    action: "update",
    userId,
    changedBalance,
    currentTransaction: {
      amount: transaction.amount,
      transaction_type: transaction.transaction_type as TTransactionTypes,
      transaction_date: transaction.transaction_date,
    },
    oldTransaction: {
      amount: oldData.amount,
      transaction_type: oldData.transaction_type,
      transaction_date: oldData.transaction_date.toUTCString(),
    },
  });

  return;
}

/**
 * This function deletes an existing transaction from the database.
 * It also updates the user's balance and the summary of the user's balance.
 * @param {TTransaction} transaction - The transaction object to be deleted
 * @throws {Error} if there is no user ID
 * @throws {{type: string, ...error}} if there is an error deleting the transaction
 */
export async function deleteTransaction(transaction: TTransaction) {
  // Create a new client to interact with the database
  const supabase = createClient();

  // Get the user ID from the supabase session
  const userId = (await supabase.auth.getUser()).data.user?.id;

  // If there is no user ID, throw an error
  if (!userId) throw Error("No user ID");

  // Get the ID of the transaction to be deleted
  const transactionId = transaction.transaction_id;

  // Delete the transaction from the database
  const { error: transactionError } = await supabase
    .from("transactions")
    .delete()
    .eq("transaction_id", transactionId);

  // If there was an error deleting the transaction, throw an error
  if (transactionError)
    throw { type: "transaction-delete", ...transactionError };

  // Calculate the change in balance for the user
  const changedBalance = await handleBalance(
    transaction.transaction_type === "income" ? "decrement" : "increment",
    userId,
    transaction.amount
  );

  // Update the summary of the user's balance with the deleted transaction
  await updateSummary({
    action: "delete",
    userId,
    changedBalance,
    currentTransaction: {
      amount: transaction.amount,
      transaction_type: transaction.transaction_type as TTransactionTypes,
      transaction_date: transaction.transaction_date,
    },
  });

  // Revalidate the path to trigger a cache update
  revalidatePath("/home");

  return;
}
