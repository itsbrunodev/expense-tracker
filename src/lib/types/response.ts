import { PostgrestError } from "@supabase/supabase-js";

export type IResponse<K extends string, T> = {
  [P in K]: T;
} & {
  error: PostgrestError;
};
