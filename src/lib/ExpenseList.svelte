<script>
  export let expense;
</script>

<li class="flex p-6 gap-6 max-w-md">
  <div class="bg-zinc-200 h-12 w-12 rounded-full"></div>
  <div class="grow">
    <p class="font-medium">{expense['Name']}</p>
    <p class="text-zinc-500 font-light">{expense['Paid By']}</p>
  </div>
  <p class="text-right">{expense['Amount']?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
</li>