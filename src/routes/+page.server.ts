import { supabase } from "$lib/supabaseClient";
import type { PageServerLoad } from "./$types"
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (events) => {
  const session = await events.locals.auth()
  console.log(session);

  if (!session?.user?.name) {
    redirect(303, `/signin`)
  }

  const { data } = await supabase.from("expenses").select(`id, name, amount, created_at, paid_by ( name ), category ( name, icon, color)`);
  
  return {
    session,
    expenses: data ?? [],
  };
}