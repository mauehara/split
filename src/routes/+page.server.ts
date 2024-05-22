import { supabase } from "$lib/supabaseClient";
import type { PageServerLoad } from "./$types"
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (events) => {
  const session = await events.locals.auth()
  console.log(session);

  if (!session?.user?.name) {
    redirect(303, `/signin`)
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

  console.log(startOfMonth, endOfMonth);

  const { data } = await supabase.from("expenses")
                                 .select(`id, name, amount, created_at, paid_by ( name ), category ( name, icon, color)`)
                                 .gte('created_at', startOfMonth)
                                 .lte('created_at', endOfMonth)
                                 .order('created_at', { ascending: false });
  
  return {
    session,
    expenses: data ?? [],
  };
}