import { supabase } from "$lib/supabaseClient";
import type { PageServerLoad, Actions } from "./$types"
import { redirect } from "@sveltejs/kit";
import { formatToNumber } from 'simple-mask-money';
import { generateId } from '$lib/utils';

export const load: PageServerLoad = async (events) => {
  // const session = await events.locals.auth()

  // if (!session?.user?.name) {
  //   redirect(303, `/signin`)
  // }
  const session = {
    user: {
      email: 'mau.uehara@gmail.com',
      name: 'Mauricio Uehara',
      image: 'https://lh3.googleusercontent.com/a-/AOh14Gg2tQK8ZvT0v9wZ1fLz9p5aZJX6hJv6Ql9v3oZw=s96-c',
    }
  };

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
            category ( id, name, icon, color)`
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
    .select('id, name, icon, color');
  
  return {
    session,
    balance,
    expenses: expenses.data ?? [],
    categories: categories.data ?? [],
  };
}

export const actions = {
	add: async ({ request }) => {
		const data = await request.formData();
    const amount = formatToNumber(data.get('amount'));
    const name = data.get('name');
    const category = data.get('categoryId');
    const paid_by = data.get('userEmail') === 'mau.uehara@gmail.com' ? '7vcwGPXwfJRvhOsE79zM' : '8dBPvYahDhTfeCnyPgyo';
    const id = generateId(20);
    const created_at = new Date().toISOString();

    const { error } = await supabase
      .from('expenses')
      .insert({ id, amount, name, category, paid_by, created_at });
    
    if (error) {
      console.log('error', error);
      return { success: false, error: error.message };
    }
    else
      return { success: true };
	},

  delete: async ({ request }) => {
    const data = await request.formData();
    const id = data.get('id');
    
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq('id', id);

    if (error) {
      console.log('error', error);
      return { success: false, error: error.message };
    }
    else {
      console.log('success')
      return { success: true };
    }
  },
} satisfies Actions;