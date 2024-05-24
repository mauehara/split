<script>
  import Drawer from './drawer.svelte';
  import ExpenseList from '$lib/ExpenseList.svelte';
  import * as Avatar from "$lib/components/ui/avatar";

  export let data;

  $: balance = data.balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  
</script>

<Drawer categories={data.categories} userEmail={data.session.user?.email} />
<main class="flex flex-col items-center bg-zinc-50" data-vaul-drawer-wrapper>
  <header class="w-full p-10 pb-0 flex justify-between">
    <h1 class="mt-10 mb-0 scroll-m-20 text-md tracking-tight transition-colors first:mt-0">{`Olá, ${data.session.user?.name?.split(' ')[0]}`}</h1>
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
  <ul class="w-full max-w-lg ">
    {#each data.expenses as expense}
      <ExpenseList {expense} userEmail={data.session.user?.email} />
    {/each}
  </ul>
</main>
