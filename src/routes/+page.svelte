<script>
  import ExpenseList from '$lib/ExpenseList.svelte';
  export let data;
</script>

<main class="flex flex-col items-center bg-zinc-50">
  <header class="w-full p-10">
    <h1 class="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Olá</h1>
  </header>
  <ul>
    {#each data.expenses as expense}
      <ExpenseList {expense} />
    {/each}
  </ul>
</main>
