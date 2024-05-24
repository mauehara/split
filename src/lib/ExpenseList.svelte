<script lang="ts">
  import { builderActions, getAttrs, type Builder } from "bits-ui";

  export let expense;
  export let userEmail;
  export let builders: Builder[] = [];
</script>

<li>
  <button use:builderActions={{ builders }} {...getAttrs(builders)} class="tracking-tight flex text-left p-6 gap-5 bg-white w-full">
    <div class="flex flex-col items-center justify-center self-center">
      <p class="text-center text-sm text-zinc-500 font-light">{new Date(expense.created_at).getDate()}</p>
      <p class="text-center text-sm text-zinc-500 font-light">{new Date(expense.created_at).toLocaleString("pt-BR", { month: "short" }).slice(0, -1)}</p>
    </div>
    <div class={"h-12 w-12 rounded-xl flex justify-center items-center"} style={`background-color: ${expense.category.color}`}>
      {expense.category.icon}
    </div>
    <div class="grow">
      <p class="font-medium">{expense.name}</p>
      <p class="text-sm text-zinc-500 font-light">{userEmail === expense.paid_by.email ? "Você" : expense.paid_by.name}</p>
    </div>
    <p class="text-sm text-right">{expense.amount?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
  </button>
</li>