<script>
  import Drawer from './drawer.svelte';
  import ExpenseDrawer from '$lib/ExpenseDrawer.svelte';
  import * as Avatar from "$lib/components/ui/avatar";

  export let data;

  $: balance = data.balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const greeting = () => {
    const date = new Date();
    const hours = date.getHours();
    if (hours >= 0 && hours < 12) return '🌤️ Bom dia';
    if (hours >= 12 && hours < 18) return '☀️ Boa tarde';
    return '🌒 Boa noite';
  };
  
</script>

<Drawer allExpenses={data.stream.allExpenses} categories={data.stream.categories} userEmail={data.session.user?.email} />
<main class="flex flex-col items-center bg-zinc-50" data-vaul-drawer-wrapper>
  <header class="w-full p-4 pb-0 flex justify-between">
    <h1 class="mt-10 mb-0 scroll-m-20 text-md tracking-tight transition-colors first:mt-0">
      {`${greeting()}, ${data.session.user?.name?.split(' ')[0]}`}
    </h1>
    <Avatar.Root>
      <Avatar.Image src={data.session.user?.image} alt="Foto de perfil" />
      <Avatar.Fallback>{data.session.user?.name?.split(' ').map(word => word[0]).join('')}</Avatar.Fallback>
    </Avatar.Root>
  </header>
  <div class="p-10 pb-20">
    <p class="tracking-tight text-sm text-center mb-2">Seu saldo</p>
    <div class="flex gap-2 items-center">
      <p class="tracking-tight text-3xl font-bold">
        {balance}
      </p>
      {#if data.balance < 0}
        <div class="w-2 h-2 bg-red-500 rounded-full"></div>
      {:else}
        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
      {/if}
    </div>
  </div>
  <ul class="w-full max-w-lg rounded-t-2xl overflow-hidden">
    {#await data.stream.expenses}
      <p class="text-center">Carregando...</p>
    {:then expenses}   
      {#each expenses as expense}
        <ExpenseDrawer allExpenses={data.stream.allExpenses} expense={expense} userEmail={data.session.user?.email} categories={data.stream.categories} />
      {/each}
    {/await}
  </ul>
</main>
