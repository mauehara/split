<script>
  export let expense;
  export let userEmail;
</script>

<li class="tracking-tight flex p-6 gap-5 bg-white first:rounded-t-2xl last:rounded-b-2xl">
  <div class="flex flex-col items-center justify-center">
    <p class="text-center text-sm text-zinc-500 font-light">{new Date(expense.created_at).getDate()}</p>
    <p class="text-center text-sm text-zinc-500 font-light">{new Date(expense.created_at).toLocaleString("pt-BR", { month: "short" }).slice(0, -1)}</p>
  </div>
  <div class={"h-12 w-12 rounded-full flex justify-center items-center"} style={`background-color: ${expense.category.color}`}>
    {expense.category.icon}
  </div>
  <div class="grow">
    <p class="font-medium">{expense.name}</p>
    <p class="text-sm text-zinc-500 font-light">{userEmail === expense.paid_by.email ? "Você" : expense.paid_by.name}</p>
  </div>
  <p class="text-sm text-right">{expense.amount?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
</li>