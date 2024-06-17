import { IResponse } from "@/lib/types/response";
import { Database } from "@/lib/types/supabase";

import { createClient } from "../server";

export type TProfile = Database["public"]["Tables"]["profile"]["Row"];
export async function getProfile(userId: string) {
  const supabase = createClient();

  /* const userId = (await supabase.auth.getUser()).data.user?.id!; */

  const { data: profile, error } = await supabase
    .from("profile")
    .upsert({ user_id: userId })
    .select()
    .single();

  return { profile, error } as IResponse<"profile", TProfile>;
}

export type TSettings = Database["public"]["Tables"]["settings"]["Row"];
export async function getSettings(userId: string) {
  const supabase = createClient();

  /* const userId = (await supabase.auth.getUser()).data.user?.id!; */

  const { data: settings, error } = await supabase
    .from("settings")
    .upsert({ user_id: userId })
    .select()
    .single();

  return { settings, error } as IResponse<"settings", TSettings>;
}

export type TTransaction = Database["public"]["Tables"]["transactions"]["Row"];
export async function getTransactions(userId: string) {
  const supabase = createClient();

  /* const userId = (await supabase.auth.getUser()).data.user?.id!; */

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select()
    .eq("user_id", userId)
    .order("transaction_date", { ascending: false });

  return { transactions, error } as IResponse<"transactions", TTransaction[]>;
}
