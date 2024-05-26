import type { PageServerLoad, Actions } from "./$types"
import { supabase } from "$lib/supabaseClient";
import { redirect } from "@sveltejs/kit";
import { formatToNumber } from 'simple-mask-money';
import { generateId } from '$lib/utils';

const MAU_UEHARA_ID = '7vcwGPXwfJRvhOsE79zM';
const LIA_SEGRE_ID = '8dBPvYahDhTfeCnyPgyo';
const CATEGORIA_CREDITO_ID = 'pT8exg1yZKcJapX5xh9F';

export const load: PageServerLoad = async (events) => {
  const session = await events.locals.auth()

  if (!session?.user?.name) {
    redirect(303, `/signin`)
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15).toISOString();
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

  const allExpenses = await supabase
    .from("expenses")
    .select(`name, category`)
  
  const myExpenses = await supabase
    .from("expenses")
    .select('paid_by!inner (email), amount')
    .eq('paid_by.email', session.user.email);
  
  const paidByUser = await supabase.from("sum_amount_by_email").select('*').eq('email', session.user.email);
  const total = await supabase.from("expenses").select('amount.sum()');
  const balance = paidByUser.data[0].sum - (total.data[0].sum / 2);

  const categories = await supabase
    .from("categories")
    .select('id, name, icon, color')
    .order('name');
  
  return {
    session,
    balance,
    allExpenses: allExpenses.data ?? [],
    expenses: expenses.data ?? [],
    categories: categories.data ?? [],
  };
}

export const actions = {
	add: async ({ request }) => {
		const data = await request.formData();
    const name = data.get('name');
    const category = data.get('categoryId');
    const paid_by = data.get('userEmail') === 'mau.uehara@gmail.com' ? MAU_UEHARA_ID : LIA_SEGRE_ID;
    const id = generateId(20);
    const created_at = new Date().toISOString();
    const amount = category === CATEGORIA_CREDITO_ID ? -formatToNumber(data.get('amount')) : formatToNumber(data.get('amount'));

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

  update: async ({ request }) => {
    const data = await request.formData();
    const id = data.get('id');
    const name = data.get('name');
    const category = data.get('categoryId');
    const amount = category === CATEGORIA_CREDITO_ID ? -formatToNumber(data.get('amount')) : formatToNumber(data.get('amount'));
    
    const { error } = await supabase
      .from("expenses")
      .update({ amount, name, category })
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