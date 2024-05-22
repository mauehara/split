<script>
  import ExpenseList from '$lib/ExpenseList.svelte';
  export let data;
</script>

<main class="flex flex-col items-center">
  <header class="bg-indigo-500 w-full bg-zinc-800 p-10">
    <h1 class="mt-10 scroll-m-20 text-white pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Bom dia</h1>
  </header>
  <ul>
    {#each data.expenses as expense}
      <ExpenseList {expense} />
    {/each}
  </ul>
</main>
