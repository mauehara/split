import { supabase } from "$lib/supabaseClient";

export async function load() {
  const { data } = await supabase.from("expenses").select();
  console.log(data);
  return {
    expenses: data ?? [],
  };
}