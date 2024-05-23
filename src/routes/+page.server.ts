import { supabase } from "$lib/supabaseClient";
import type { PageServerLoad, Actions } from "./$types"
import { redirect } from "@sveltejs/kit";
import { formatToNumber } from 'simple-mask-money';

export const load: PageServerLoad = async (events) => {
  const session = await events.locals.auth()

  if (!session?.user?.name) {
    redirect(303, `/signin`)
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

  const expenses = await supabase
    .from("expenses")
    .select(`id, 
            name, 
            amount, 
            created_at, 
            paid_by ( id, name, email ), 
            category ( name, icon, color)`
          )
    .gte('created_at', startOfMonth)
    .lte('created_at', endOfMonth)
    .order('created_at', { ascending: false });
  
  const myExpenses = await supabase
    .from("expenses")
    .select('paid_by!inner (email), amount')
    .eq('paid_by.email', session.user.email);
  
  const myExpensesAmount = myExpenses.data.reduce((acc: number, expense: { amount: number; }) => acc + expense.amount, 0);
  const total = await supabase.from("expenses").select('amount.sum()');
  const balance = total.data[0].sum - 2 * myExpensesAmount;

  const categories = await supabase
    .from("categories")
    .select('name, icon, color');
  
  return {
    session,
    balance,
    expenses: expenses.data ?? [],
    categories: categories.data ?? [],
  };
}

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
    const amount = formatToNumber(data.get('amount'));
    console.log(amount);
	},
} satisfies Actions;