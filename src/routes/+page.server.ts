import { supabase } from "$lib/supabaseClient";

export async function load() {
  const { data } = await supabase.from("expenses").select(`id, name, amount, created_at, paid_by ( name ), category ( name, icon, color)`);
  
  return {
    expenses: data ?? [],
  };
}