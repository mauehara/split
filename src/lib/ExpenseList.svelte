<script>
  export let expense;
</script>

<li class="flex p-6 gap-5 max-w-md bg-white first:rounded-t-2xl last:rounded-b-2xl">
  <div>
    <p class="text-center text-sm text-zinc-500 font-light">{new Date(expense.created_at).getDate()}</p>
    <p class="text-center text-sm text-zinc-500 font-light">{new Date(expense.created_at).toLocaleString("pt-BR", { month: "short" }).slice(0, -1)}</p>
  </div>
  <div class={"h-12 w-12 rounded-full flex justify-center items-center"} style={`background-color: ${expense.category.color}`}>
    {expense.category.icon}
  </div>
  <div class="grow">
    <p class="font-medium">{expense.name}</p>
    <p class="text-sm text-zinc-500 font-light">{expense.paid_by.name}</p>
  </div>
  <p class="text-right">{expense.amount?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
</li>